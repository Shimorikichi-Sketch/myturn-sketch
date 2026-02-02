import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays, isBefore, startOfDay } from "date-fns";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  available: boolean;
}

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let half = 0; half < 2; half++) {
      const startMinute = half * 30;
      const endMinute = startMinute + 30;
      const startHour = hour;
      const endHour = endMinute === 60 ? hour + 1 : hour;
      
      slots.push({
        id: `${hour}-${half}`,
        start: `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`,
        end: `${String(endHour).padStart(2, "0")}:${String(endMinute === 60 ? 0 : endMinute).padStart(2, "0")}`,
        available: Math.random() > 0.3, // Simulate availability
      });
    }
  }
  return slots;
};

const AdvanceBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  const institution = location.state?.institution;
  const service = location.state?.service;

  const handleConfirm = () => {
    if (selectedDate && selectedSlot && institution && service) {
      navigate("/customer/certainty", {
        state: {
          ...location.state,
          advanceBooking: true,
          selectedDate: format(selectedDate, "yyyy-MM-dd"),
          selectedSlot,
        },
      });
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 14); // Allow booking up to 14 days ahead

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
            Advance Booking
          </h1>
          <p className="text-sm text-muted-foreground">
            {institution?.name || "Select date and time"}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Calendar Section */}
          <section className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Select Date</h2>
            </div>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => 
                isBefore(date, today) || isBefore(maxDate, date)
              }
              className="rounded-xl border-0"
            />
          </section>

          {/* Time Slots Section */}
          {selectedDate && (
            <section className="bg-card rounded-2xl border border-border/50 p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">
                  Available Slots for {format(selectedDate, "MMM d")}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      !slot.available
                        ? "bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-50"
                        : selectedSlot?.id === slot.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {formatTime(slot.start)} – {formatTime(slot.end)}
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Greyed out slots are already booked
              </p>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      {selectedDate && selectedSlot && (
        <footer className="p-6 border-t border-border/50 bg-card/95 backdrop-blur-sm animate-fade-in">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-muted-foreground">Selected:</span>
              <span className="font-medium text-foreground">
                {format(selectedDate, "EEE, MMM d")} • {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}
              </span>
            </div>
            <Button
              variant="default"
              size="lg"
              className="w-full rounded-xl"
              onClick={handleConfirm}
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AdvanceBooking;
