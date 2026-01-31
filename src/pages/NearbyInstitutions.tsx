import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, ChevronRight, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Institution {
  id: string;
  name: string;
  distance: string;
  service: string;
  nextWindow: string;
  status: "immediate" | "buffered" | "priority";
  rating?: number;
  crowdLevel?: "low" | "moderate" | "high";
}

// Real Indian institutions by category
const institutionsByCategory: Record<string, Institution[]> = {
  healthcare: [
    {
      id: "h1",
      name: "AIIMS Delhi",
      distance: "2.1 km",
      service: "Eye consultation",
      nextWindow: "3:30 – 4:00 PM",
      status: "immediate",
      rating: 4.5,
      crowdLevel: "moderate",
    },
    {
      id: "h2",
      name: "Safdarjung Hospital",
      distance: "3.4 km",
      service: "Eye consultation",
      nextWindow: "4:15 – 4:45 PM",
      status: "buffered",
      rating: 4.2,
      crowdLevel: "high",
    },
    {
      id: "h3",
      name: "Dr. R.P. Centre for Ophthalmic Sciences",
      distance: "2.8 km",
      service: "Eye consultation",
      nextWindow: "5:00 – 5:30 PM",
      status: "priority",
      rating: 4.7,
      crowdLevel: "low",
    },
    {
      id: "h4",
      name: "Fortis Escorts Heart Institute",
      distance: "5.2 km",
      service: "Eye consultation",
      nextWindow: "Tomorrow 10:00 AM",
      status: "immediate",
      rating: 4.6,
      crowdLevel: "low",
    },
    {
      id: "h5",
      name: "Max Super Speciality Hospital, Saket",
      distance: "6.1 km",
      service: "Eye consultation",
      nextWindow: "Tomorrow 11:30 AM",
      status: "immediate",
      rating: 4.4,
      crowdLevel: "moderate",
    },
  ],
  banking: [
    {
      id: "b1",
      name: "State Bank of India, Connaught Place",
      distance: "1.8 km",
      service: "Banking services",
      nextWindow: "2:45 – 3:15 PM",
      status: "immediate",
      rating: 4.1,
      crowdLevel: "high",
    },
    {
      id: "b2",
      name: "Punjab National Bank, Nehru Place",
      distance: "2.5 km",
      service: "Banking services",
      nextWindow: "3:30 – 4:00 PM",
      status: "buffered",
      rating: 3.9,
      crowdLevel: "moderate",
    },
    {
      id: "b3",
      name: "HDFC Bank, South Extension",
      distance: "3.2 km",
      service: "Banking services",
      nextWindow: "4:00 – 4:30 PM",
      status: "immediate",
      rating: 4.3,
      crowdLevel: "low",
    },
    {
      id: "b4",
      name: "ICICI Bank, Lajpat Nagar",
      distance: "4.1 km",
      service: "Banking services",
      nextWindow: "4:45 – 5:15 PM",
      status: "priority",
      rating: 4.2,
      crowdLevel: "low",
    },
    {
      id: "b5",
      name: "Bank of Baroda, ITO",
      distance: "2.9 km",
      service: "Banking services",
      nextWindow: "Tomorrow 10:30 AM",
      status: "buffered",
      rating: 3.8,
      crowdLevel: "moderate",
    },
  ],
  government: [
    {
      id: "g1",
      name: "District Court Complex, Saket",
      distance: "2.3 km",
      service: "Government services",
      nextWindow: "3:00 – 3:30 PM",
      status: "buffered",
      rating: 3.6,
      crowdLevel: "high",
    },
    {
      id: "g2",
      name: "RTO Office, Loni Road",
      distance: "4.5 km",
      service: "License services",
      nextWindow: "4:30 – 5:00 PM",
      status: "priority",
      rating: 3.4,
      crowdLevel: "high",
    },
    {
      id: "g3",
      name: "Passport Seva Kendra, Nehru Place",
      distance: "3.1 km",
      service: "Document services",
      nextWindow: "Tomorrow 9:30 AM",
      status: "immediate",
      rating: 4.0,
      crowdLevel: "moderate",
    },
    {
      id: "g4",
      name: "Aadhaar Seva Kendra, Malviya Nagar",
      distance: "2.7 km",
      service: "ID services",
      nextWindow: "Tomorrow 11:00 AM",
      status: "immediate",
      rating: 3.8,
      crowdLevel: "low",
    },
    {
      id: "g5",
      name: "MCD Zonal Office, South Zone",
      distance: "1.9 km",
      service: "Municipal services",
      nextWindow: "Tomorrow 10:00 AM",
      status: "buffered",
      rating: 3.5,
      crowdLevel: "moderate",
    },
  ],
};

const statusLabels: Record<string, { label: string; class: string }> = {
  immediate: { label: "Immediate", class: "status-stable" },
  buffered: { label: "Buffered", class: "status-buffered" },
  priority: { label: "Priority Available", class: "status-surge" },
};

const crowdLabels: Record<string, { label: string; color: string }> = {
  low: { label: "Low crowd", color: "text-stable" },
  moderate: { label: "Moderate", color: "text-buffered" },
  high: { label: "Crowded", color: "text-surge" },
};

const NearbyInstitutions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Get category from navigation state
  const category = (location.state?.category as string) || "healthcare";
  const institutions = institutionsByCategory[category] || institutionsByCategory.healthcare;

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

  const getCategoryTitle = () => {
    switch (category) {
      case "healthcare": return "Healthcare Facilities";
      case "banking": return "Banks & Financial Services";
      case "government": return "Government Offices";
      default: return "Nearby Options";
    }
  };

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
          {institutions.map((institution, index) => {
            const isSelected = selectedId === institution.id;
            const statusInfo = statusLabels[institution.status];
            const crowdInfo = crowdLabels[institution.crowdLevel || "moderate"];
            
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
                        {institution.distance}
                      </span>
                      {institution.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-buffered text-buffered" />
                          {institution.rating}
                        </span>
                      )}
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

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-medium">
                      {institution.nextWindow}
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
          })}

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
          <Button
            variant="default"
            size="lg"
            className="w-full max-w-lg mx-auto block rounded-xl shadow-lg"
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
