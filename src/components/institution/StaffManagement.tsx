import { useState } from "react";
import { 
  Users, 
  ArrowRight, 
  UserPlus, 
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Staff {
  id: string;
  name: string;
  role: "manager" | "operator" | "staff";
  assigned_service: string | null;
  is_available: boolean;
}

interface Service {
  id: string;
  name: string;
  staffCount: number;
  demand: "low" | "normal" | "high" | "surge";
}

interface StaffManagementProps {
  staff: Staff[];
  services: Service[];
  onReassign: (staffId: string, fromService: string | null, toService: string) => void;
}

const demandColors = {
  low: "text-muted-foreground",
  normal: "text-stable",
  high: "text-buffered",
  surge: "text-surge",
};

export const StaffManagement = ({ staff, services, onReassign }: StaffManagementProps) => {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [targetService, setTargetService] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleReassign = () => {
    if (selectedStaff && targetService) {
      onReassign(selectedStaff.id, selectedStaff.assigned_service, targetService);
      setIsOpen(false);
      setSelectedStaff(null);
      setTargetService("");
    }
  };

  const getServiceStaff = (serviceId: string) => 
    staff.filter(s => s.assigned_service === serviceId);

  const unassignedStaff = staff.filter(s => !s.assigned_service);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Staff Distribution</h2>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl">
              <UserPlus className="w-4 h-4 mr-2" />
              Reassign Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reassign Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Staff</label>
                <Select
                  value={selectedStaff?.id || ""}
                  onValueChange={(id) => setSelectedStaff(staff.find(s => s.id === id) || null)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.filter(s => s.is_available).map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedStaff && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Currently:</span>
                  <span className="font-medium text-foreground">
                    {selectedStaff.assigned_service 
                      ? services.find(s => s.id === selectedStaff.assigned_service)?.name 
                      : "Unassigned"}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Assign to Service</label>
                <Select value={targetService} onValueChange={setTargetService}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{service.name}</span>
                          <span className={`text-xs ${demandColors[service.demand]}`}>
                            {service.demand.toUpperCase()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleReassign} 
                className="w-full rounded-xl"
                disabled={!selectedStaff || !targetService}
              >
                Confirm Reassignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service-wise Staff Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {services.map(service => {
          const serviceStaff = getServiceStaff(service.id);
          const needsMore = service.demand === "surge" || service.demand === "high";

          return (
            <div 
              key={service.id}
              className={`p-4 rounded-xl border bg-card ${
                needsMore ? "border-buffered/50" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">{service.name}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  service.demand === "surge" ? "bg-surge/10 text-surge" :
                  service.demand === "high" ? "bg-buffered/10 text-buffered" :
                  "bg-stable/10 text-stable"
                }`}>
                  {service.demand.toUpperCase()} demand
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {serviceStaff.length} staff assigned
                </span>
                {needsMore && (
                  <span className="text-xs text-buffered flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Needs reinforcement
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {serviceStaff.map(s => (
                  <span 
                    key={s.id}
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      s.is_available 
                        ? "bg-stable/10 text-stable" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.name}
                  </span>
                ))}
                {serviceStaff.length === 0 && (
                  <span className="text-xs text-muted-foreground">No staff assigned</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unassigned Staff */}
      {unassignedStaff.length > 0 && (
        <div className="p-4 rounded-xl border bg-accent/30">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">Available Staff</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {unassignedStaff.map(s => (
              <span 
                key={s.id}
                className="px-2 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendation */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">AI Recommendation</h4>
            <p className="text-sm text-muted-foreground">
              Based on predicted surge between 11am–1pm, consider moving 2 staff 
              from Eye Consultation to General OPD during peak hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
