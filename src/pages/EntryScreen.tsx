import { Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EntryScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      {/* Logo / Brand */}
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="text-4xl font-semibold tracking-tight text-primary mb-2">
          MyTurn
        </h1>
        <p className="text-muted-foreground text-lg">
          Reach the right place at the right time
        </p>
      </div>

      {/* Role Selection */}
      <div className="w-full max-w-lg space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <button
          onClick={() => navigate("/customer")}
          className="role-card w-full group"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-medium text-foreground mb-1">
            I'm a Customer
          </h2>
          <p className="text-muted-foreground text-sm">
            Find services and book with certainty
          </p>
        </button>

        <button
          onClick={() => navigate("/institution")}
          className="role-card w-full group"
        >
          <div className="w-16 h-16 rounded-full bg-institutional/10 flex items-center justify-center mb-4 group-hover:bg-institutional/20 transition-colors">
            <Building2 className="w-8 h-8 text-institutional" />
          </div>
          <h2 className="text-xl font-medium text-foreground mb-1">
            I Manage an Institution
          </h2>
          <p className="text-muted-foreground text-sm">
            Control demand and manage flow
          </p>
        </button>
      </div>

      {/* Reassurance */}
      <p className="mt-12 text-sm text-muted-foreground text-center max-w-md animate-fade-in" style={{ animationDelay: '200ms' }}>
        We help you reach the right place at the right time — without unnecessary waiting.
      </p>
    </div>
  );
};

export default EntryScreen;
