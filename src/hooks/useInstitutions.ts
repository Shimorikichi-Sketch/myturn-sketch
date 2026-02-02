import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGeolocation } from "./useGeolocation";

export interface Institution {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  operating_hours: { open: string; close: string } | unknown;
  crowd_level: "low" | "moderate" | "high" | "surge";
  is_active: boolean;
  distance?: number;
  travelTime?: number;
  departureTime?: string;
  services?: Service[];
}

export interface Service {
  id: string;
  institution_id: string;
  name: string;
  category: string;
  subcategory: string | null;
  normal_capacity: number;
  current_inflow: number;
  buffered_count: number;
  avg_service_time_minutes: number;
  status: "active" | "paused" | "surge" | "closed";
  surge_threshold: number;
  buffer_threshold: number;
}

export const useInstitutions = (category?: string) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { latitude, longitude, calculateDistance, calculateTravelTime } = useGeolocation();

  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("institutions")
        .select(`
          *,
          services(*)
        `)
        .eq("is_active", true);

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Calculate distance and travel time if we have user location
      const institutionsWithDistance = (data || []).map((inst) => {
        const distance = latitude && longitude
          ? calculateDistance(Number(inst.latitude), Number(inst.longitude))
          : null;
        
        const travelTime = distance ? calculateTravelTime(distance, "drive") : null;

        // Calculate when to leave to arrive at next available slot
        let departureTime: string | undefined;
        if (travelTime) {
          const now = new Date();
          const departAt = new Date(now.getTime() + travelTime * 60000);
          departureTime = departAt.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        return {
          ...inst,
          latitude: Number(inst.latitude),
          longitude: Number(inst.longitude),
          distance: distance ? Math.round(distance * 10) / 10 : undefined,
          travelTime: travelTime || undefined,
          departureTime,
        };
      });

      // Sort by distance if available
      institutionsWithDistance.sort((a, b) => {
        if (a.distance && b.distance) {
          return a.distance - b.distance;
        }
        return 0;
      });

      setInstitutions(institutionsWithDistance);
    } catch (err: any) {
      console.error("Error fetching institutions:", err);
      setError(err.message || "Failed to fetch institutions");
    } finally {
      setLoading(false);
    }
  }, [category, latitude, longitude, calculateDistance, calculateTravelTime]);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  return {
    institutions,
    loading,
    error,
    refetch: fetchInstitutions,
  };
};

export default useInstitutions;
