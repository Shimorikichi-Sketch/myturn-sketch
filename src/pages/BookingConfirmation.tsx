import { useLocation, useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Calendar,
  ArrowLeft,
  Share2,
  Bell,
  Navigation,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCode } from "@/components/QRCode";
import { format } from "date-fns";

interface BookingDetails {
  id: string;
  qr_code: string;
  institution_name: string;
  institution_address: string;
  service_name: string;
  booking_date: string;
  time_slot_start: string;
  time_slot_end: string;
  booking_type: string;
  queue_position?: number;
  travel_time?: number;
  departure_time?: string;
}

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking as BookingDetails;

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold text-foreground mb-2">
          No booking found
        </h1>
        <p className="text-muted-foreground mb-6 text-center">
          Unable to find booking details. Please try again.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">
          Return Home
        </Button>
      </div>
    );
  }

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

  const formattedDate = format(new Date(booking.booking_date), "EEEE, MMMM d, yyyy");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stable/10 to-background">
      {/* Header */}
      <header className="p-6 flex items-center gap-4">
        <button 
          onClick={() => navigate("/")}
          className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-semibold text-foreground">
          Booking Confirmed
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 pb-8">
        <div className="max-w-md mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-stable/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-stable" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              You're all set!
            </h2>
            <p className="text-muted-foreground">
              Your slot has been confirmed
            </p>
          </div>

          {/* QR Code Card */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6 shadow-lg animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-2">Scan at check-in</p>
              <div className="inline-block p-4 bg-white rounded-xl">
                <QRCode value={booking.qr_code} size={180} />
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                {booking.qr_code}
              </p>
            </div>
          </div>

          {/* Booking Details Card */}
          <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h3 className="font-semibold text-foreground mb-4">Booking Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{booking.institution_name}</p>
                  <p className="text-sm text-muted-foreground">{booking.institution_address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{formattedDate}</p>
                  <p className="text-sm text-muted-foreground">{booking.service_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {formatTime(booking.time_slot_start)} – {formatTime(booking.time_slot_end)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {booking.booking_type} booking
                    {booking.queue_position && ` • Position #${booking.queue_position}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Travel Info Card */}
          {booking.travel_time && (
            <div className="bg-accent/30 rounded-2xl border border-accent-foreground/10 p-5 mb-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Leave by {booking.departure_time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ~{booking.travel_time} min travel time to arrive on time
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-buffered/10 rounded-xl p-4 mb-6 border border-buffered/20 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-buffered flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Arrive on time</p>
                <p className="text-muted-foreground">
                  Please arrive 10 minutes before your window. Late arrivals may be 
                  moved back 2 positions in the queue instead of being skipped.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-xl"
              onClick={() => {
                // Add to calendar functionality
                const startDate = new Date(`${booking.booking_date}T${booking.time_slot_start}`);
                const endDate = new Date(`${booking.booking_date}T${booking.time_slot_end}`);
                const title = `MyTurn: ${booking.service_name} at ${booking.institution_name}`;
                const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${endDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(`Booking ID: ${booking.qr_code}`)}`;
                window.open(url, "_blank");
              }}
            >
              <Bell className="w-5 h-5 mr-2" />
              Add to Calendar
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-xl"
              onClick={() => {
                navigator.share?.({
                  title: "MyTurn Booking",
                  text: `Booking at ${booking.institution_name} on ${formattedDate}`,
                });
              }}
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Details
            </Button>

            <Button
              variant="default"
              size="lg"
              className="w-full rounded-xl"
              onClick={() => navigate("/customer/bookings")}
            >
              View My Bookings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;
