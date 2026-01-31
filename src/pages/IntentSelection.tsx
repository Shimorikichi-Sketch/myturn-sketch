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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-6 border-b border-border flex items-center gap-4">
        <button 
          onClick={() => selectedCategory ? setSelectedCategory(null) : navigate(-1)}
          className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors"
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
                  className="intent-card w-full animate-fade-in"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-foreground">{category.name}</h3>
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
                  className={`intent-card w-full animate-fade-in ${isSelected ? 'intent-card-selected' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-stable/20' : 'bg-secondary'}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-stable' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`flex-1 text-left font-medium ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                    {purpose.name}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-stable flex items-center justify-center">
                      <svg className="w-3 h-3 text-stable-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <footer className="p-6 border-t border-border bg-card animate-fade-in">
          <Button
            variant="default"
            size="lg"
            className="w-full max-w-lg mx-auto block"
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
