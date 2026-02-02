
-- Create enum types
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'snoozed');
CREATE TYPE public.service_status AS ENUM ('active', 'paused', 'surge', 'closed');
CREATE TYPE public.crowd_level AS ENUM ('low', 'moderate', 'high', 'surge');
CREATE TYPE public.staff_role AS ENUM ('manager', 'operator', 'staff');

-- Institutions table
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- healthcare, banking, government
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone TEXT,
  operating_hours JSONB DEFAULT '{"open": "09:00", "close": "17:00"}'::jsonb,
  crowd_level crowd_level DEFAULT 'low',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Services offered by institutions
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- maps to intent categories
  subcategory TEXT, -- specific service type
  normal_capacity INTEGER DEFAULT 20,
  current_inflow INTEGER DEFAULT 0,
  buffered_count INTEGER DEFAULT 0,
  avg_service_time_minutes INTEGER DEFAULT 15,
  status service_status DEFAULT 'active',
  surge_threshold INTEGER DEFAULT 25,
  buffer_threshold INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  full_name TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings table with snooze support
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  time_slot_start TIME NOT NULL,
  time_slot_end TIME NOT NULL,
  queue_position INTEGER,
  original_position INTEGER, -- for tracking snooze penalty
  snooze_count INTEGER DEFAULT 0,
  status booking_status DEFAULT 'confirmed',
  booking_type TEXT DEFAULT 'immediate', -- immediate, scheduled, priority
  qr_code TEXT,
  checked_in_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Staff management for institutions
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role staff_role DEFAULT 'staff',
  assigned_service_id UUID REFERENCES public.services(id),
  is_available BOOLEAN DEFAULT true,
  shift_start TIME,
  shift_end TIME,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics data for institutions
CREATE TABLE public.institution_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hour INTEGER CHECK (hour >= 0 AND hour <= 23),
  total_footfall INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  missed_bookings INTEGER DEFAULT 0,
  avg_wait_time_minutes DECIMAL(5,2),
  peak_load_time TIME,
  buffer_usage_percent DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Demand predictions for surge planning
CREATE TABLE public.demand_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id),
  predicted_date DATE NOT NULL,
  predicted_hour INTEGER CHECK (predicted_hour >= 0 AND predicted_hour <= 23),
  predicted_demand INTEGER,
  confidence_percent DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Staff assignments/redistributions
CREATE TABLE public.staff_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  from_service_id UUID REFERENCES public.services(id),
  to_service_id UUID REFERENCES public.services(id) NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  reason TEXT,
  start_time TIMESTAMPTZ DEFAULT now(),
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Institutions: public read, staff can update their own
CREATE POLICY "Anyone can view institutions" ON public.institutions FOR SELECT USING (true);

-- Services: public read
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);

-- Profiles: users can manage their own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Bookings: users can manage their own
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- Staff: institution managers can manage
CREATE POLICY "Staff can view their institution" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Managers can manage staff" ON public.staff FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() 
    AND s.institution_id = staff.institution_id 
    AND s.role = 'manager'
  )
);

-- Analytics: staff can view their institution
CREATE POLICY "Staff can view analytics" ON public.institution_analytics FOR SELECT USING (true);

-- Predictions: staff can view
CREATE POLICY "Anyone can view predictions" ON public.demand_predictions FOR SELECT USING (true);

-- Staff assignments: managers can manage
CREATE POLICY "View assignments" ON public.staff_assignments FOR SELECT USING (true);

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for bookings and services
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;

-- Seed initial institutions data (real Indian institutions)
INSERT INTO public.institutions (name, category, address, city, latitude, longitude, phone) VALUES
-- Delhi Healthcare
('AIIMS Delhi', 'healthcare', 'Ansari Nagar East, New Delhi', 'Delhi', 28.5672, 77.2100, '011-26588500'),
('Safdarjung Hospital', 'healthcare', 'Ansari Nagar West, New Delhi', 'Delhi', 28.5680, 77.2050, '011-26707437'),
('Sir Ganga Ram Hospital', 'healthcare', 'Rajinder Nagar, New Delhi', 'Delhi', 28.6400, 77.1900, '011-25750000'),
-- Delhi Banking
('State Bank of India - Connaught Place', 'banking', 'Connaught Place, New Delhi', 'Delhi', 28.6315, 77.2167, '011-23341841'),
('HDFC Bank - Karol Bagh', 'banking', 'Karol Bagh, New Delhi', 'Delhi', 28.6520, 77.1900, '1800-202-6161'),
('ICICI Bank - Nehru Place', 'banking', 'Nehru Place, New Delhi', 'Delhi', 28.5494, 77.2530, '1800-200-3344'),
-- Delhi Government
('RTO Delhi - IP Estate', 'government', 'IP Estate, New Delhi', 'Delhi', 28.6280, 77.2450, '011-23378888'),
('Passport Seva Kendra - Bhikaji Cama', 'government', 'Bhikaji Cama Place, New Delhi', 'Delhi', 28.5700, 77.1850, '1800-258-1800'),
('MCD Zonal Office - South', 'government', 'Daryaganj, New Delhi', 'Delhi', 28.6400, 77.2400, '011-23890000'),
-- Mumbai Healthcare
('Tata Memorial Hospital', 'healthcare', 'Parel, Mumbai', 'Mumbai', 19.0048, 72.8430, '022-24177000'),
('Lilavati Hospital', 'healthcare', 'Bandra West, Mumbai', 'Mumbai', 19.0509, 72.8296, '022-26751000'),
-- Mumbai Banking
('SBI Main Branch - Fort', 'banking', 'Fort, Mumbai', 'Mumbai', 18.9322, 72.8347, '022-22660424'),
('HDFC Bank - Bandra', 'banking', 'Bandra West, Mumbai', 'Mumbai', 19.0544, 72.8265, '1800-202-6161');

-- Seed services for institutions
INSERT INTO public.services (institution_id, name, category, subcategory, normal_capacity, avg_service_time_minutes) 
SELECT 
  id,
  'General OPD',
  'healthcare',
  'general_checkup',
  30,
  20
FROM public.institutions WHERE category = 'healthcare';

INSERT INTO public.services (institution_id, name, category, subcategory, normal_capacity, avg_service_time_minutes) 
SELECT 
  id,
  'Eye Consultation',
  'healthcare',
  'eye_consultation',
  20,
  25
FROM public.institutions WHERE category = 'healthcare';

INSERT INTO public.services (institution_id, name, category, subcategory, normal_capacity, avg_service_time_minutes) 
SELECT 
  id,
  'Account Opening',
  'banking',
  'account_opening',
  15,
  30
FROM public.institutions WHERE category = 'banking';

INSERT INTO public.services (institution_id, name, category, subcategory, normal_capacity, avg_service_time_minutes) 
SELECT 
  id,
  'Passbook Update',
  'banking',
  'passbook_update',
  40,
  5
FROM public.institutions WHERE category = 'banking';

INSERT INTO public.services (institution_id, name, category, subcategory, normal_capacity, avg_service_time_minutes) 
SELECT 
  id,
  'License Renewal',
  'government',
  'license_renewal',
  25,
  20
FROM public.institutions WHERE category = 'government';

INSERT INTO public.services (institution_id, name, category, subcategory, normal_capacity, avg_service_time_minutes) 
SELECT 
  id,
  'Document Submission',
  'government',
  'document_submission',
  30,
  15
FROM public.institutions WHERE category = 'government';
