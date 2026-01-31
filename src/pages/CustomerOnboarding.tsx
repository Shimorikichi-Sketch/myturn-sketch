import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CustomerOnboarding = () => {
  const navigate = useNavigate();
  const [locationSet, setLocationSet] = useState(false);

  const handleLocationAccess = () => {
    // In production, would request geolocation
    setLocationSet(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="p-6 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-primary">MyTurn</h1>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Location Card */}
          <div className="p-6 rounded-2xl border-2 border-border/50 bg-card shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Your Location</h3>
                <p className="text-sm text-muted-foreground">
                  Required to find nearby services
                </p>
              </div>
            </div>

            {!locationSet ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLocationAccess}
              >
                Allow Location Access
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-stable">
                <div className="w-2 h-2 rounded-full bg-stable" />
                <span className="text-sm font-medium">Location set</span>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <Button
            variant="default"
            size="lg"
            className="w-full"
            disabled={!locationSet}
            onClick={() => navigate("/customer/intent")}
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Reassurance */}
          <p className="text-center text-sm text-muted-foreground">
            Your location is used only to find nearby services.
            <br />
            We never share it with third parties.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CustomerOnboarding;
