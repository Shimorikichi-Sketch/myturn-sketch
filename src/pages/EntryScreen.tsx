import { Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EntryScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-secondary/20 px-6">
      {/* Logo / Brand */}
      <div className="mb-14 text-center animate-fade-in">
        <h1 className="text-5xl font-bold tracking-tight text-primary mb-3">
          MyTurn
        </h1>
        <p className="text-muted-foreground text-lg font-light">
          Reach the right place at the right time
        </p>
      </div>

      {/* Role Selection */}
      <div className="w-full max-w-lg space-y-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <button
          onClick={() => navigate("/customer")}
          className="w-full group relative flex flex-col items-center justify-center p-10 rounded-3xl border-2 border-border/50 bg-card transition-all duration-300 cursor-pointer hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-5 group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-300">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            I'm a Customer
          </h2>
          <p className="text-muted-foreground">
            Find services and book with certainty
          </p>
        </button>

        <button
          onClick={() => navigate("/institution")}
          className="w-full group relative flex flex-col items-center justify-center p-10 rounded-3xl border-2 border-border/50 bg-card transition-all duration-300 cursor-pointer hover:border-institutional/40 hover:shadow-xl hover:shadow-institutional/10 hover:-translate-y-1"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-institutional/15 to-institutional/5 flex items-center justify-center mb-5 group-hover:from-institutional/25 group-hover:to-institutional/10 transition-all duration-300">
            <Building2 className="w-10 h-10 text-institutional" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            I Manage an Institution
          </h2>
          <p className="text-muted-foreground">
            Control demand and manage flow
          </p>
        </button>
      </div>

      {/* Reassurance */}
      <p className="mt-14 text-sm text-muted-foreground/70 text-center max-w-md animate-fade-in font-light" style={{ animationDelay: '200ms' }}>
        We help you reach the right place at the right time — without unnecessary waiting.
      </p>
    </div>
  );
};

export default EntryScreen;
