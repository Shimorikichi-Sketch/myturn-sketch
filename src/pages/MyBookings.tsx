import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookings, Booking } from "@/hooks/useBookings";
import { format } from "date-fns";

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  confirmed: { icon: CheckCircle2, color: "text-stable", label: "Confirmed" },
  pending: { icon: Clock, color: "text-buffered", label: "Pending" },
  checked_in: { icon: CheckCircle2, color: "text-primary", label: "Checked In" },
  completed: { icon: CheckCircle2, color: "text-muted-foreground", label: "Completed" },
  cancelled: { icon: XCircle, color: "text-surge", label: "Cancelled" },
  snoozed: { icon: AlertTriangle, color: "text-buffered", label: "Snoozed" },
};

const MyBookings = () => {
  const navigate = useNavigate();
  const { bookings, loading, cancelBooking } = useBookings();

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

  const upcomingBookings = bookings.filter(
    (b) => ["confirmed", "pending", "snoozed"].includes(b.status)
  );
  
  const pastBookings = bookings.filter(
    (b) => ["completed", "cancelled", "checked_in"].includes(b.status)
  );

  const renderBookingCard = (booking: Booking, isPast: boolean) => {
    const status = statusConfig[booking.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
      <div
        key={booking.id}
        className={`bg-card rounded-2xl border border-border/50 p-5 ${
          isPast ? "opacity-70" : ""
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              {booking.institution?.name || "Institution"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {booking.service?.name || "Service"}
            </p>
          </div>
          <span className={`flex items-center gap-1.5 text-sm font-medium ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(booking.booking_date), "EEE, MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {formatTime(booking.time_slot_start)} – {formatTime(booking.time_slot_end)}
            </span>
            {booking.queue_position && (
              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                Position #{booking.queue_position}
              </span>
            )}
          </div>
        </div>

        {booking.snooze_count > 0 && (
          <div className="flex items-center gap-2 text-sm text-buffered bg-buffered/10 rounded-lg px-3 py-2 mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span>Snoozed {booking.snooze_count} time(s) due to late arrival</span>
          </div>
        )}

        {!isPast && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl"
              onClick={() => navigate(`/customer/booking/${booking.id}`, { 
                state: { 
                  booking: {
                    id: booking.id,
                    qr_code: booking.qr_code,
                    institution_name: booking.institution?.name,
                    institution_address: booking.institution?.address,
                    service_name: booking.service?.name,
                    booking_date: booking.booking_date,
                    time_slot_start: booking.time_slot_start,
                    time_slot_end: booking.time_slot_end,
                    booking_type: booking.booking_type,
                    queue_position: booking.queue_position,
                  }
                } 
              })}
            >
              <QrCode className="w-4 h-4 mr-1" />
              View QR
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-surge hover:text-surge hover:bg-surge/10"
              onClick={() => cancelBooking(booking.id)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    );
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
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">
            My Bookings
          </h1>
          <p className="text-sm text-muted-foreground">
            {upcomingBookings.length} upcoming
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="max-w-lg mx-auto space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">
                No bookings yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Book a slot at your preferred institution
              </p>
              <Button onClick={() => navigate("/customer")} className="rounded-xl">
                Make a Booking
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ) : (
            <>
              {/* Upcoming Bookings */}
              {upcomingBookings.length > 0 && (
                <section>
                  <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Upcoming
                  </h2>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => renderBookingCard(booking, false))}
                  </div>
                </section>
              )}

              {/* Past Bookings */}
              {pastBookings.length > 0 && (
                <section>
                  <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Past
                  </h2>
                  <div className="space-y-4">
                    {pastBookings.map((booking) => renderBookingCard(booking, true))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* New Booking Button */}
      {bookings.length > 0 && (
        <footer className="p-6 border-t border-border/50 bg-card/80 backdrop-blur-sm">
          <Button
            variant="default"
            size="lg"
            className="w-full max-w-lg mx-auto block rounded-xl"
            onClick={() => navigate("/customer")}
          >
            New Booking
          </Button>
        </footer>
      )}
    </div>
  );
};

export default MyBookings;
