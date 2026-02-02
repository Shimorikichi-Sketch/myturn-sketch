import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Zap, Clock, Star, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookings } from "@/hooks/useBookings";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface CertaintyOption {
  id: string;
  type: "immediate" | "scheduled" | "priority";
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
}

const CertaintySelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { createBooking } = useBookings();

  const institution = location.state?.institution;
  const service = location.state?.service;
  const advanceBooking = location.state?.advanceBooking;
  const selectedDate = location.state?.selectedDate;
  const selectedSlot = location.state?.selectedSlot;

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Generate time windows
  const getTimeWindows = () => {
    if (advanceBooking && selectedSlot) {
      return {
        scheduled: {
          start: selectedSlot.start,
          end: selectedSlot.end,
          display: `${format(new Date(`2000-01-01T${selectedSlot.start}`), "h:mm a")} – ${format(new Date(`2000-01-01T${selectedSlot.end}`), "h:mm a")}`,
        },
      };
    }

    const now = new Date();
    const immediateStart = new Date(now.getTime() + 15 * 60000);
    const immediateEnd = new Date(immediateStart.getTime() + 30 * 60000);
    const scheduledStart = new Date(now.getTime() + 90 * 60000);
    const scheduledEnd = new Date(scheduledStart.getTime() + 30 * 60000);

    return {
      immediate: {
        start: format(immediateStart, "HH:mm"),
        end: format(immediateEnd, "HH:mm"),
        display: "~15-30 min wait",
      },
      scheduled: {
        start: format(scheduledStart, "HH:mm"),
        end: format(scheduledEnd, "HH:mm"),
        display: `${format(scheduledStart, "h:mm a")} – ${format(scheduledEnd, "h:mm a")}`,
      },
    };
  };

  const timeWindows = getTimeWindows();

  const certaintyOptions: CertaintyOption[] = advanceBooking
    ? [
        {
          id: "scheduled",
          type: "scheduled",
          title: "Confirmed Slot",
          description: "Your selected time slot is confirmed",
          time: timeWindows.scheduled?.display || "",
          icon: Clock,
        },
      ]
    : [
        {
          id: "immediate",
          type: "immediate",
          title: "Immediate Arrival",
          description: "Arrive now and be served when available",
          time: timeWindows.immediate?.display || "~15-30 min wait",
          icon: Zap,
        },
        {
          id: "scheduled",
          type: "scheduled",
          title: "Guaranteed Window",
          description: "Arrive within your confirmed time slot",
          time: timeWindows.scheduled?.display || "",
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

  const handleConfirm = async () => {
    if (!selected) return;

    // Check if user is logged in
    if (!user) {
      navigate("/auth", { state: { returnTo: location.pathname, ...location.state } });
      return;
    }

    if (!institution || !service) {
      console.error("Missing institution or service data");
      return;
    }

    setLoading(true);

    const selectedOption = certaintyOptions.find(o => o.id === selected);
    const bookingDate = advanceBooking && selectedDate 
      ? selectedDate 
      : format(new Date(), "yyyy-MM-dd");

    let timeStart = "09:00";
    let timeEnd = "09:30";

    if (selected === "immediate" && timeWindows.immediate) {
      timeStart = timeWindows.immediate.start;
      timeEnd = timeWindows.immediate.end;
    } else if ((selected === "scheduled" || advanceBooking) && timeWindows.scheduled) {
      timeStart = timeWindows.scheduled.start;
      timeEnd = timeWindows.scheduled.end;
    }

    const booking = await createBooking({
      institution_id: institution.id,
      service_id: service.id,
      booking_date: bookingDate,
      time_slot_start: timeStart,
      time_slot_end: timeEnd,
      booking_type: selectedOption?.type || "immediate",
      queue_position: Math.floor(Math.random() * 20) + 1,
    });

    setLoading(false);

    if (booking) {
      navigate("/customer/confirmation", {
        state: {
          booking: {
            id: booking.id,
            qr_code: booking.qr_code,
            institution_name: institution.name,
            institution_address: institution.address,
            service_name: service.name,
            booking_date: booking.booking_date,
            time_slot_start: booking.time_slot_start,
            time_slot_end: booking.time_slot_end,
            booking_type: booking.booking_type,
            queue_position: booking.queue_position,
            travel_time: institution.travelTime,
            departure_time: institution.departureTime,
          },
        },
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
            Choose Your Certainty
          </h1>
          <p className="text-sm text-muted-foreground">
            {institution?.name || "Institution"} • {service?.name || "Service"}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="max-w-lg mx-auto space-y-4">
          {advanceBooking && selectedDate && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4">
              <p className="text-sm text-foreground">
                <strong>Booking for:</strong> {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          )}

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

          {/* Snooze Policy Notice */}
          <div className="p-4 rounded-xl bg-buffered/10 border border-buffered/20 mt-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Late arrival policy:</strong> If you arrive after your 
              scheduled window, you'll be moved back 2 positions in the queue instead of being skipped entirely.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      {selected && (
        <footer className="p-6 border-t border-border bg-card animate-fade-in">
          <Button
            variant="default"
            size="lg"
            className="w-full max-w-lg mx-auto block rounded-xl"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </footer>
      )}
    </div>
  );
};

export default CertaintySelection;
