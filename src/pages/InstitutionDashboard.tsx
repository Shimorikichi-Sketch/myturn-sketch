import { useState, useEffect } from "react";
import { 
  Activity, 
  Users, 
  Clock, 
  TrendingUp,
  Settings,
  BarChart3,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCard } from "@/components/institution/ServiceCard";
import { AnalyticsChart } from "@/components/institution/AnalyticsChart";
import { StaffManagement } from "@/components/institution/StaffManagement";
import { DemandPrediction } from "@/components/institution/DemandPrediction";

interface ServiceData {
  id: string;
  name: string;
  current_inflow: number;
  normal_capacity: number;
  buffered_count: number;
  status: "active" | "paused" | "surge" | "closed";
  surge_threshold: number;
}

// Mock data for demonstration
const mockHourlyData = [
  { hour: "9AM", footfall: 12, completed: 10, buffered: 2 },
  { hour: "10AM", footfall: 18, completed: 15, buffered: 5 },
  { hour: "11AM", footfall: 25, completed: 20, buffered: 8 },
  { hour: "12PM", footfall: 30, completed: 22, buffered: 12 },
  { hour: "1PM", footfall: 28, completed: 25, buffered: 10 },
  { hour: "2PM", footfall: 20, completed: 18, buffered: 6 },
  { hour: "3PM", footfall: 15, completed: 14, buffered: 3 },
  { hour: "4PM", footfall: 10, completed: 10, buffered: 1 },
];

const mockServiceDistribution = [
  { name: "Eye Consultation", value: 35 },
  { name: "General OPD", value: 40 },
  { name: "Dental Check", value: 15 },
  { name: "Blood Test", value: 10 },
];

const mockPredictions = [
  { hour: "9AM", predicted: 15, capacity: 20, confidence: 85 },
  { hour: "10AM", predicted: 22, capacity: 20, confidence: 80 },
  { hour: "11AM", predicted: 28, capacity: 20, confidence: 75 },
  { hour: "12PM", predicted: 35, capacity: 20, confidence: 70 },
  { hour: "1PM", predicted: 30, capacity: 20, confidence: 72 },
  { hour: "2PM", predicted: 25, capacity: 20, confidence: 78 },
  { hour: "3PM", predicted: 18, capacity: 20, confidence: 82 },
  { hour: "4PM", predicted: 12, capacity: 20, confidence: 88 },
];

const mockStaff = [
  { id: "s1", name: "Dr. Sharma", role: "staff" as const, assigned_service: "eye", is_available: true },
  { id: "s2", name: "Dr. Patel", role: "staff" as const, assigned_service: "eye", is_available: true },
  { id: "s3", name: "Dr. Kumar", role: "staff" as const, assigned_service: "opd", is_available: true },
  { id: "s4", name: "Dr. Singh", role: "operator" as const, assigned_service: "opd", is_available: true },
  { id: "s5", name: "Nurse Gupta", role: "staff" as const, assigned_service: null, is_available: true },
];

const mockServiceStaff = [
  { id: "eye", name: "Eye Consultation", staffCount: 2, demand: "high" as const },
  { id: "opd", name: "General OPD", staffCount: 2, demand: "surge" as const },
  { id: "dental", name: "Dental Check", staffCount: 0, demand: "low" as const },
];

const InstitutionDashboard = () => {
  const [pausedServices, setPausedServices] = useState<Set<string>>(new Set());
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [liveFlow, setLiveFlow] = useState({
    arriving: 24,
    buffered: 20,
    processing: 18,
    completed: 156,
  });

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .limit(6);

        if (error) throw error;

        // Add mock current data for demonstration
        const servicesWithData = (data || []).map((s, i) => ({
          id: s.id,
          name: s.name,
          current_inflow: 10 + Math.floor(Math.random() * 20),
          normal_capacity: s.normal_capacity,
          buffered_count: Math.floor(Math.random() * 10),
          status: (["active", "active", "surge", "active"][i % 4]) as ServiceData["status"],
          surge_threshold: s.surge_threshold,
        }));

        setServices(servicesWithData);
      } catch (error) {
        console.error("Error fetching services:", error);
        // Use fallback data
        setServices([
          { id: "1", name: "Eye Consultation", current_inflow: 12, normal_capacity: 20, buffered_count: 3, status: "active", surge_threshold: 25 },
          { id: "2", name: "Dental Check", current_inflow: 8, normal_capacity: 15, buffered_count: 0, status: "active", surge_threshold: 20 },
          { id: "3", name: "Blood Test", current_inflow: 18, normal_capacity: 20, buffered_count: 5, status: "surge", surge_threshold: 22 },
          { id: "4", name: "General OPD", current_inflow: 25, normal_capacity: 20, buffered_count: 12, status: "surge", surge_threshold: 25 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    // Simulate live flow updates
    const interval = setInterval(() => {
      setLiveFlow(prev => ({
        arriving: prev.arriving + Math.floor(Math.random() * 3) - 1,
        buffered: Math.max(0, prev.buffered + Math.floor(Math.random() * 3) - 1),
        processing: prev.processing + Math.floor(Math.random() * 2),
        completed: prev.completed + Math.floor(Math.random() * 2),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const togglePause = (serviceId: string) => {
    setPausedServices(prev => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });

    // Update service status in database (in a real app)
    // This would update the service status and affect customer-facing availability
  };

  const handleStaffReassign = (staffId: string, fromService: string | null, toService: string) => {
    console.log(`Reassigning staff ${staffId} from ${fromService} to ${toService}`);
    // In a real app, this would update the database
  };

  const totalInflow = services.reduce((sum, s) => sum + s.current_inflow, 0);
  const totalCapacity = services.reduce((sum, s) => sum + s.normal_capacity, 0);
  const totalBuffered = services.reduce((sum, s) => sum + s.buffered_count, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Institutional Header */}
      <header className="header-institutional px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-institutional-foreground">
              City Eye Hospital
            </h1>
            <p className="text-sm text-institutional-foreground/70">
              Institution Control Panel
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-institutional-foreground hover:bg-institutional-foreground/10">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-institutional-foreground hover:bg-institutional-foreground/10">
              <BarChart3 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="metric-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Live Inflow</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">{totalInflow}</p>
                <p className="text-sm text-muted-foreground">per hour</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Capacity</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">{totalCapacity}</p>
                <p className="text-sm text-muted-foreground">total slots</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Buffered</span>
                </div>
                <p className="text-3xl font-semibold text-buffered">{totalBuffered}</p>
                <p className="text-sm text-muted-foreground">waiting</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Utilization</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">
                  {Math.round((totalInflow / totalCapacity) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">current</p>
              </div>
            </div>

            {/* Service Status Grid */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Service Status
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isPaused={pausedServices.has(service.id)}
                    onTogglePause={() => togglePause(service.id)}
                  />
                ))}
              </div>
            </div>

            {/* Live Flow Visualization */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Live Flow
              </h2>
              <div className="flex gap-2">
                <div className="flow-segment flow-arriving">
                  <p className="text-2xl font-semibold text-primary">{liveFlow.arriving}</p>
                  <p className="text-sm text-muted-foreground">Arriving</p>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground self-center flex-shrink-0" />
                <div className="flow-segment flow-buffered">
                  <p className="text-2xl font-semibold text-buffered">{liveFlow.buffered}</p>
                  <p className="text-sm text-muted-foreground">Buffered</p>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground self-center flex-shrink-0" />
                <div className="flow-segment flow-processing">
                  <p className="text-2xl font-semibold text-stable">{liveFlow.processing}</p>
                  <p className="text-sm text-muted-foreground">Processing</p>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground self-center flex-shrink-0" />
                <div className="flow-segment flow-completed">
                  <p className="text-2xl font-semibold text-foreground">{liveFlow.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <AnalyticsChart
                type="hourly"
                data={mockHourlyData}
                title="Hourly Footfall & Completed"
              />
              <AnalyticsChart
                type="distribution"
                data={mockServiceDistribution}
                title="Service Distribution"
              />
            </div>
            <AnalyticsChart
              type="buffer"
              data={mockHourlyData}
              title="Buffer Usage Throughout Day"
            />

            {/* Insights */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-medium text-foreground mb-2">Peak Hours</h3>
                <p className="text-2xl font-semibold text-primary mb-1">11am – 1pm</p>
                <p className="text-sm text-muted-foreground">Highest demand period</p>
              </div>
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-medium text-foreground mb-2">Avg Wait Time</h3>
                <p className="text-2xl font-semibold text-buffered mb-1">18 min</p>
                <p className="text-sm text-muted-foreground">During peak hours</p>
              </div>
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-medium text-foreground mb-2">Buffer Efficiency</h3>
                <p className="text-2xl font-semibold text-stable mb-1">92%</p>
                <p className="text-sm text-muted-foreground">Successfully processed</p>
              </div>
            </div>
          </TabsContent>

          {/* Staff Management Tab */}
          <TabsContent value="staff">
            <StaffManagement
              staff={mockStaff}
              services={mockServiceStaff}
              onReassign={handleStaffReassign}
            />
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast">
            <DemandPrediction
              predictions={mockPredictions}
              surgeThreshold={25}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default InstitutionDashboard;
