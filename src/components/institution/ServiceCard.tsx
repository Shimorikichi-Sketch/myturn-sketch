import { Pause, Play, AlertTriangle } from "lucide-react";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    current_inflow: number;
    normal_capacity: number;
    buffered_count: number;
    status: "active" | "paused" | "surge" | "closed";
  };
  isPaused: boolean;
  onTogglePause: () => void;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-stable/10", text: "text-stable", label: "Active" },
  paused: { bg: "bg-muted/10", text: "text-muted-foreground", label: "Paused" },
  surge: { bg: "bg-surge/10", text: "text-surge", label: "Surge" },
  closed: { bg: "bg-muted/10", text: "text-muted-foreground", label: "Closed" },
};

export const ServiceCard = ({ service, isPaused, onTogglePause }: ServiceCardProps) => {
  const utilizationPercent = Math.round((service.current_inflow / service.normal_capacity) * 100);
  const statusInfo = statusColors[service.status] || statusColors.active;

  // Determine color based on utilization
  const getProgressColor = () => {
    if (utilizationPercent >= 100) return "bg-surge";
    if (utilizationPercent >= 75) return "bg-buffered";
    return "bg-stable";
  };

  return (
    <div className={`p-5 rounded-xl border bg-card transition-opacity ${isPaused ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-medium text-foreground">{service.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
              {statusInfo.label}
            </span>
            {service.buffered_count > 0 && (
              <span className="text-xs text-muted-foreground">
                {service.buffered_count} buffered
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onTogglePause}
          className={`p-2 rounded-lg transition-colors ${
            isPaused
              ? "bg-stable/10 text-stable hover:bg-stable/20"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
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
            {service.current_inflow} / {service.normal_capacity}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
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
};

export default ServiceCard;
