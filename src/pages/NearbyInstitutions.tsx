import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, ChevronRight, Star, Users, Navigation, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstitutions, Institution } from "@/hooks/useInstitutions";

const statusLabels: Record<string, { label: string; class: string }> = {
  low: { label: "Immediate", class: "status-stable" },
  moderate: { label: "Buffered", class: "status-buffered" },
  high: { label: "Priority Available", class: "status-surge" },
  surge: { label: "High Demand", class: "status-surge" },
};

const crowdLabels: Record<string, { label: string; color: string }> = {
  low: { label: "Low crowd", color: "text-stable" },
  moderate: { label: "Moderate", color: "text-buffered" },
  high: { label: "Crowded", color: "text-surge" },
  surge: { label: "Very crowded", color: "text-surge" },
};

const NearbyInstitutions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  // Get category from navigation state
  const category = (location.state?.category as string) || "healthcare";
  const subcategory = location.state?.subcategory as string | undefined;
  
  const { institutions, loading, error, refetch } = useInstitutions(category);

  const handleSelect = (institution: Institution) => {
    setSelectedId(institution.id);
    setSelectedInstitution(institution);
  };

  const handleContinue = () => {
    if (selectedId && selectedInstitution) {
      const service = selectedInstitution.services?.[0]; // Get first matching service
      navigate("/customer/certainty", { 
        state: { 
          ...location.state, 
          institutionId: selectedId,
          institution: selectedInstitution,
          service: service,
        } 
      });
    }
  };

  const handleAdvanceBooking = () => {
    if (selectedId && selectedInstitution) {
      const service = selectedInstitution.services?.[0];
      navigate("/customer/advance-booking", {
        state: {
          ...location.state,
          institutionId: selectedId,
          institution: selectedInstitution,
          service: service,
        },
      });
    }
  };

  const getCategoryTitle = () => {
    switch (category) {
      case "healthcare": return "Healthcare Facilities";
      case "banking": return "Banks & Financial Services";
      case "government": return "Government Offices";
      default: return "Nearby Options";
    }
  };

  // Generate next available window
  const getNextWindow = (institution: Institution) => {
    const now = new Date();
    const baseMinutes = 30 + Math.floor(Math.random() * 60);
    const startTime = new Date(now.getTime() + baseMinutes * 60000);
    const endTime = new Date(startTime.getTime() + 30 * 60000);
    
    return `${startTime.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })} – ${endTime.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Finding nearby institutions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch} variant="outline" className="rounded-xl">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="p-6 border-b border-border/50 bg-card/80 backdrop-blur-sm flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {getCategoryTitle()}
          </h1>
          <p className="text-sm text-muted-foreground">
            Sorted by distance • Crowd data updated live
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 pb-32">
        <div className="max-w-lg mx-auto space-y-4">
          {institutions.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No institutions found in this category nearby.</p>
            </div>
          ) : (
            institutions.map((institution, index) => {
              const isSelected = selectedId === institution.id;
              const statusInfo = statusLabels[institution.crowd_level] || statusLabels.low;
              const crowdInfo = crowdLabels[institution.crowd_level] || crowdLabels.moderate;
              const nextWindow = getNextWindow(institution);
              
              return (
                <button
                  key={institution.id}
                  onClick={() => handleSelect(institution)}
                  className={`w-full text-left animate-fade-in p-5 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                      : 'border-border/50 bg-card hover:border-primary/30 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-3">
                      <h3 className="font-semibold text-foreground mb-1.5 leading-tight">
                        {institution.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {institution.distance ? `${institution.distance} km` : institution.address}
                        </span>
                        <span className={`flex items-center gap-1 ${crowdInfo.color}`}>
                          <Users className="w-3.5 h-3.5" />
                          {crowdInfo.label}
                        </span>
                      </div>
                    </div>
                    <span className={statusInfo.class}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Travel Time Info */}
                  {institution.travelTime && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground bg-accent/30 rounded-lg px-3 py-2">
                      <Navigation className="w-4 h-4 text-primary" />
                      <span>~{institution.travelTime} min drive</span>
                      {institution.departureTime && (
                        <>
                          <span className="text-border">•</span>
                          <span>Leave by {institution.departureTime}</span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-medium">
                        {nextWindow}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}

          {/* Crowdsource notice */}
          <div className="mt-6 p-4 rounded-xl bg-accent/30 border border-accent-foreground/10">
            <p className="text-sm text-muted-foreground text-center">
              <Users className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Crowd levels powered by community reports & live data
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      {selectedId && (
        <footer className="fixed bottom-0 left-0 right-0 p-6 border-t border-border/50 bg-card/95 backdrop-blur-sm animate-fade-in">
          <div className="max-w-lg mx-auto space-y-3">
            <Button
              variant="default"
              size="lg"
              className="w-full rounded-xl shadow-lg"
              onClick={handleContinue}
            >
              Select time window
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-xl"
              onClick={handleAdvanceBooking}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book for later
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default NearbyInstitutions;
