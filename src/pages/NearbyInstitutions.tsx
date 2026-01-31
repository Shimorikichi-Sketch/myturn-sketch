import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Institution {
  id: string;
  name: string;
  distance: string;
  service: string;
  nextWindow: string;
  status: "immediate" | "buffered" | "priority";
}

const mockInstitutions: Institution[] = [
  {
    id: "1",
    name: "City Eye Hospital",
    distance: "1.2 km",
    service: "Eye consultation",
    nextWindow: "3:30 – 4:00 PM",
    status: "immediate",
  },
  {
    id: "2",
    name: "Apollo Clinic - Sector 12",
    distance: "2.4 km",
    service: "Eye consultation",
    nextWindow: "4:15 – 4:45 PM",
    status: "buffered",
  },
  {
    id: "3",
    name: "Government District Hospital",
    distance: "3.1 km",
    service: "Eye consultation",
    nextWindow: "5:00 – 5:30 PM",
    status: "priority",
  },
  {
    id: "4",
    name: "Max Healthcare",
    distance: "4.8 km",
    service: "Eye consultation",
    nextWindow: "Tomorrow 10:00 AM",
    status: "immediate",
  },
];

const statusLabels: Record<string, { label: string; class: string }> = {
  immediate: { label: "Immediate", class: "status-stable" },
  buffered: { label: "Buffered", class: "status-buffered" },
  priority: { label: "Priority Available", class: "status-surge" },
};

const NearbyInstitutions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (institution: Institution) => {
    setSelectedId(institution.id);
  };

  const handleContinue = () => {
    if (selectedId) {
      navigate("/customer/certainty", { 
        state: { 
          ...location.state, 
          institutionId: selectedId 
        } 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-6 border-b border-border flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Nearby Options
          </h1>
          <p className="text-sm text-muted-foreground">
            Sorted by distance and availability
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 pb-32">
        <div className="max-w-lg mx-auto space-y-4">
          {mockInstitutions.map((institution, index) => {
            const isSelected = selectedId === institution.id;
            const statusInfo = statusLabels[institution.status];
            
            return (
              <button
                key={institution.id}
                onClick={() => handleSelect(institution)}
                className={`institution-card w-full text-left animate-fade-in ${isSelected ? 'ring-2 ring-primary' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">
                      {institution.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {institution.distance}
                      </span>
                    </div>
                  </div>
                  <span className={statusInfo.class}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">
                      {institution.nextWindow}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      {selectedId && (
        <footer className="fixed bottom-0 left-0 right-0 p-6 border-t border-border bg-card animate-fade-in">
          <Button
            variant="default"
            size="lg"
            className="w-full max-w-lg mx-auto block"
            onClick={handleContinue}
          >
            Select time window
            <ChevronRight className="w-5 h-5" />
          </Button>
        </footer>
      )}
    </div>
  );
};

export default NearbyInstitutions;
