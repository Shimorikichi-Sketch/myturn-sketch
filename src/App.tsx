import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EntryScreen from "./pages/EntryScreen";
import CustomerOnboarding from "./pages/CustomerOnboarding";
import IntentSelection from "./pages/IntentSelection";
import NearbyInstitutions from "./pages/NearbyInstitutions";
import CertaintySelection from "./pages/CertaintySelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import AdvanceBooking from "./pages/AdvanceBooking";
import Auth from "./pages/Auth";
import InstitutionDashboard from "./pages/InstitutionDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EntryScreen />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/customer" element={<CustomerOnboarding />} />
          <Route path="/customer/intent" element={<IntentSelection />} />
          <Route path="/customer/nearby" element={<NearbyInstitutions />} />
          <Route path="/customer/certainty" element={<CertaintySelection />} />
          <Route path="/customer/confirmation" element={<BookingConfirmation />} />
          <Route path="/customer/booking/:id" element={<BookingConfirmation />} />
          <Route path="/customer/bookings" element={<MyBookings />} />
          <Route path="/customer/advance-booking" element={<AdvanceBooking />} />
          <Route path="/institution" element={<InstitutionDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
