import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Clock, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertaintyOption {
  id: string;
  type: "immediate" | "scheduled" | "priority";
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
}

const certaintyOptions: CertaintyOption[] = [
  {
    id: "immediate",
    type: "immediate",
    title: "Immediate Arrival",
    description: "Arrive now and be served when available",
    time: "~15-30 min wait",
    icon: Zap,
  },
  {
    id: "scheduled",
    type: "scheduled",
    title: "Guaranteed Window",
    description: "Arrive within your confirmed time slot",
    time: "3:30 – 4:00 PM",
    icon: Clock,
  },
  {
    id: "priority",
    type: "priority",
    title: "Priority Access",
    description: "For urgent cases or eligible categories",
    time: "Next available",
    icon: Star,
  },
];

const CertaintySelection = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-stable/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-stable" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Confirmed
          </h1>
          <p className="text-muted-foreground mb-2">
            City Eye Hospital
          </p>
          <p className="text-lg font-medium text-primary mb-8">
            3:30 – 4:00 PM Today
          </p>
          
          <div className="p-4 rounded-lg bg-accent/50 border border-stable/20 mb-8 max-w-sm">
            <p className="text-sm text-foreground">
              Please arrive 10 minutes before your window.
              Bring valid ID and any relevant documents.
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

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
            Choose Your Certainty
          </h1>
          <p className="text-sm text-muted-foreground">
            City Eye Hospital • 1.2 km away
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="max-w-lg mx-auto space-y-4">
          {certaintyOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selected === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-150 animate-fade-in ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-card hover:border-primary/30'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-primary/20' : 'bg-secondary'
                  }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {option.description}
                    </p>
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {option.time}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {/* Transparency Note */}
          <p className="text-xs text-muted-foreground text-center pt-4">
            Priority access is available for senior citizens, pregnant women,
            and medically urgent cases. Proof may be required.
          </p>
        </div>
      </main>

      {/* Footer */}
      {selected && (
        <footer className="p-6 border-t border-border bg-card animate-fade-in">
          <Button
            variant="default"
            size="lg"
            className="w-full max-w-lg mx-auto block"
            onClick={handleConfirm}
          >
            Confirm Booking
          </Button>
        </footer>
      )}
    </div>
  );
};

export default CertaintySelection;
