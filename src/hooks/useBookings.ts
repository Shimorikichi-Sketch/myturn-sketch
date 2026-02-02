import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Booking {
  id: string;
  user_id: string | null;
  institution_id: string;
  service_id: string;
  booking_date: string;
  time_slot_start: string;
  time_slot_end: string;
  queue_position: number | null;
  original_position: number | null;
  snooze_count: number;
  status: string;
  booking_type: string;
  qr_code: string | null;
  checked_in_at: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  institution?: {
    name: string;
    address: string;
  };
  service?: {
    name: string;
  };
}

interface CreateBookingParams {
  institution_id: string;
  service_id: string;
  booking_date: string;
  time_slot_start: string;
  time_slot_end: string;
  booking_type: string;
  queue_position?: number;
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          institution:institutions(name, address),
          service:services(name)
        `)
        .eq("user_id", user.id)
        .order("booking_date", { ascending: true })
        .order("time_slot_start", { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch bookings",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (params: CreateBookingParams): Promise<Booking | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to make a booking",
        });
        return null;
      }

      // Generate QR code data
      const qrCode = `MYTURN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          institution_id: params.institution_id,
          service_id: params.service_id,
          booking_date: params.booking_date,
          time_slot_start: params.time_slot_start,
          time_slot_end: params.time_slot_end,
          booking_type: params.booking_type,
          queue_position: params.queue_position || null,
          original_position: params.queue_position || null,
          qr_code: qrCode,
          status: "confirmed",
        })
        .select(`
          *,
          institution:institutions(name, address),
          service:services(name)
        `)
        .single();

      if (error) throw error;

      toast({
        title: "Booking confirmed!",
        description: "Your slot has been reserved",
      });

      return data;
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: error.message || "Unable to create booking",
      });
      return null;
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled",
      });

      await fetchBookings();
      return true;
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel booking",
      });
      return false;
    }
  };

  // Snooze penalty: move booking back 2 positions
  const snoozeBooking = async (bookingId: string): Promise<boolean> => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return false;

      const newPosition = (booking.queue_position || 0) + 2;

      const { error } = await supabase
        .from("bookings")
        .update({
          queue_position: newPosition,
          snooze_count: (booking.snooze_count || 0) + 1,
          status: "snoozed",
        })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Booking snoozed",
        description: `You've been moved back 2 positions. New position: ${newPosition}`,
      });

      await fetchBookings();
      return true;
    } catch (error: any) {
      console.error("Error snoozing booking:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchBookings();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    bookings,
    loading,
    fetchBookings,
    createBooking,
    cancelBooking,
    snoozeBooking,
  };
};

export default useBookings;
