import { useState } from "react";
import { 
  Activity, 
  Users, 
  Clock, 
  TrendingUp,
  Pause,
  Play,
  Settings,
  BarChart3,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceMetric {
  id: string;
  name: string;
  inflow: number;
  capacity: number;
  status: "low" | "normal" | "high" | "surge";
  buffered: number;
}

const services: ServiceMetric[] = [
  { id: "1", name: "Eye Consultation", inflow: 12, capacity: 20, status: "normal", buffered: 3 },
  { id: "2", name: "Dental Check", inflow: 8, capacity: 15, status: "low", buffered: 0 },
  { id: "3", name: "Blood Test", inflow: 18, capacity: 20, status: "high", buffered: 5 },
  { id: "4", name: "General OPD", inflow: 25, capacity: 20, status: "surge", buffered: 12 },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: "bg-stable/10", text: "text-stable", label: "Low" },
  normal: { bg: "bg-stable/10", text: "text-stable", label: "Normal" },
  high: { bg: "bg-buffered/10", text: "text-buffered", label: "High" },
  surge: { bg: "bg-surge/10", text: "text-surge", label: "Surge" },
};

const InstitutionDashboard = () => {
  const [pausedServices, setPausedServices] = useState<Set<string>>(new Set());

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
  };

  const totalInflow = services.reduce((sum, s) => sum + s.inflow, 0);
  const totalCapacity = services.reduce((sum, s) => sum + s.capacity, 0);
  const totalBuffered = services.reduce((sum, s) => sum + s.buffered, 0);

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
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Service Status
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service) => {
              const isPaused = pausedServices.has(service.id);
              const statusInfo = statusColors[service.status];
              const utilizationPercent = Math.round((service.inflow / service.capacity) * 100);

              return (
                <div 
                  key={service.id} 
                  className={`p-5 rounded-lg border bg-card ${isPaused ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-foreground">{service.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                          {statusInfo.label}
                        </span>
                        {service.buffered > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {service.buffered} buffered
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => togglePause(service.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isPaused 
                          ? 'bg-stable/10 text-stable hover:bg-stable/20' 
                          : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Inflow / Capacity</span>
                      <span className="font-medium text-foreground">
                        {service.inflow} / {service.capacity}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          service.status === 'surge' ? 'bg-surge' :
                          service.status === 'high' ? 'bg-buffered' : 'bg-stable'
                        }`}
                        style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {isPaused && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Inflow paused</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Flow Visualization */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Live Flow
          </h2>
          <div className="flex gap-2">
            <div className="flow-segment flow-arriving">
              <p className="text-2xl font-semibold text-primary">24</p>
              <p className="text-sm text-muted-foreground">Arriving</p>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground self-center flex-shrink-0" />
            <div className="flow-segment flow-buffered">
              <p className="text-2xl font-semibold text-buffered">20</p>
              <p className="text-sm text-muted-foreground">Buffered</p>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground self-center flex-shrink-0" />
            <div className="flow-segment flow-processing">
              <p className="text-2xl font-semibold text-stable">18</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground self-center flex-shrink-0" />
            <div className="flow-segment flow-completed">
              <p className="text-2xl font-semibold text-foreground">156</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstitutionDashboard;
