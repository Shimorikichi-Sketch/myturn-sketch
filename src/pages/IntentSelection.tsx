import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  Building, 
  FileText, 
  Eye, 
  Stethoscope, 
  Droplets, 
  CreditCard, 
  BookOpen, 
  UserPlus,
  FileCheck,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntentCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  purposes: { id: string; name: string }[];
}

const intentCategories: IntentCategory[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Heart,
    purposes: [
      { id: "eye", name: "Eye consultation" },
      { id: "dental", name: "Dental check" },
      { id: "blood", name: "Blood test" },
      { id: "followup", name: "Follow-up visit" },
      { id: "general", name: "General consultation" },
    ],
  },
  {
    id: "banking",
    name: "Banking",
    icon: Building,
    purposes: [
      { id: "passbook", name: "Passbook update" },
      { id: "card", name: "Card issue/change" },
      { id: "account", name: "Account opening" },
      { id: "loan", name: "Loan enquiry" },
    ],
  },
  {
    id: "government",
    name: "Government",
    icon: FileText,
    purposes: [
      { id: "license", name: "License renewal" },
      { id: "document", name: "Document correction" },
      { id: "certificate", name: "Certificate request" },
      { id: "registration", name: "New registration" },
    ],
  },
];

const purposeIcons: Record<string, React.ElementType> = {
  eye: Eye,
  dental: Stethoscope,
  blood: Droplets,
  followup: FileCheck,
  general: Stethoscope,
  passbook: BookOpen,
  card: CreditCard,
  account: UserPlus,
  loan: Building,
  license: FileText,
  document: FileCheck,
  certificate: FileText,
  registration: UserPlus,
};

const IntentSelection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);

  const currentCategory = intentCategories.find(c => c.id === selectedCategory);

  const handleContinue = () => {
    if (selectedPurpose) {
      navigate("/customer/nearby", { 
        state: { category: selectedCategory, purpose: selectedPurpose } 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="p-6 border-b border-border/50 bg-card/80 backdrop-blur-sm flex items-center gap-4">
        <button 
          onClick={() => selectedCategory ? setSelectedCategory(null) : navigate(-1)}
          className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {selectedCategory ? "What do you need?" : "What brings you here?"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {selectedCategory ? `Select a ${currentCategory?.name.toLowerCase()} service` : "Select a category"}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="max-w-lg mx-auto space-y-3">
          {!selectedCategory ? (
            // Category Selection
            intentCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="w-full animate-fade-in flex items-center gap-4 p-5 rounded-2xl border-2 border-border/50 bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.purposes.length} services available
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              );
            })
          ) : (
            // Purpose Selection
            currentCategory?.purposes.map((purpose) => {
              const Icon = purposeIcons[purpose.id] || FileText;
              const isSelected = selectedPurpose === purpose.id;
              return (
                <button
                  key={purpose.id}
                  onClick={() => setSelectedPurpose(purpose.id)}
                  className={`w-full animate-fade-in flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-stable bg-stable/5 shadow-md' 
                      : 'border-border/50 bg-card hover:border-primary/30'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-stable/15' : 'bg-secondary'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors ${isSelected ? 'text-stable' : 'text-muted-foreground'}`} />
                  </div>
                  <span className="flex-1 text-left font-medium text-foreground">
                    {purpose.name}
                  </span>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-stable flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-stable-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      {selectedPurpose && (
        <footer className="p-6 border-t border-border/50 bg-card/95 backdrop-blur-sm animate-fade-in">
          <Button
            variant="default"
            size="lg"
            className="w-full max-w-lg mx-auto block rounded-xl shadow-lg"
            onClick={handleContinue}
          >
            Find nearby options
            <ChevronRight className="w-5 h-5" />
          </Button>
        </footer>
      )}
    </div>
  );
};

export default IntentSelection;
