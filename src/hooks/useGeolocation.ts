import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => void;
  calculateDistance: (lat: number, lon: number) => number;
  calculateTravelTime: (distanceKm: number, mode?: "walk" | "drive" | "transit") => number;
}

// Haversine formula for distance calculation
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Average speeds in km/h for different modes
const TRAVEL_SPEEDS = {
  walk: 5,
  drive: 25, // Average city driving speed considering traffic
  transit: 20,
};

export const useGeolocation = (): UseGeolocationReturn => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  const calculateDistance = useCallback(
    (lat: number, lon: number): number => {
      if (state.latitude === null || state.longitude === null) {
        return 0;
      }
      return haversineDistance(state.latitude, state.longitude, lat, lon);
    },
    [state.latitude, state.longitude]
  );

  const calculateTravelTime = useCallback(
    (distanceKm: number, mode: "walk" | "drive" | "transit" = "drive"): number => {
      const speed = TRAVEL_SPEEDS[mode];
      const timeInHours = distanceKm / speed;
      return Math.ceil(timeInHours * 60); // Return minutes
    },
    []
  );

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    ...state,
    requestLocation,
    calculateDistance,
    calculateTravelTime,
  };
};

export default useGeolocation;
