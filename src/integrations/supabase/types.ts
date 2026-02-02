export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          booking_type: string | null
          checked_in_at: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          institution_id: string
          notes: string | null
          original_position: number | null
          qr_code: string | null
          queue_position: number | null
          service_id: string
          snooze_count: number | null
          status: Database["public"]["Enums"]["booking_status"] | null
          time_slot_end: string
          time_slot_start: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_type?: string | null
          checked_in_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          institution_id: string
          notes?: string | null
          original_position?: number | null
          qr_code?: string | null
          queue_position?: number | null
          service_id: string
          snooze_count?: number | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          time_slot_end: string
          time_slot_start: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_type?: string | null
          checked_in_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          institution_id?: string
          notes?: string | null
          original_position?: number | null
          qr_code?: string | null
          queue_position?: number | null
          service_id?: string
          snooze_count?: number | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          time_slot_end?: string
          time_slot_start?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      demand_predictions: {
        Row: {
          confidence_percent: number | null
          created_at: string | null
          id: string
          institution_id: string
          predicted_date: string
          predicted_demand: number | null
          predicted_hour: number | null
          service_id: string | null
        }
        Insert: {
          confidence_percent?: number | null
          created_at?: string | null
          id?: string
          institution_id: string
          predicted_date: string
          predicted_demand?: number | null
          predicted_hour?: number | null
          service_id?: string | null
        }
        Update: {
          confidence_percent?: number | null
          created_at?: string | null
          id?: string
          institution_id?: string
          predicted_date?: string
          predicted_demand?: number | null
          predicted_hour?: number | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demand_predictions_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demand_predictions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_analytics: {
        Row: {
          avg_wait_time_minutes: number | null
          buffer_usage_percent: number | null
          completed_bookings: number | null
          created_at: string | null
          date: string
          hour: number | null
          id: string
          institution_id: string
          missed_bookings: number | null
          peak_load_time: string | null
          service_id: string | null
          total_footfall: number | null
        }
        Insert: {
          avg_wait_time_minutes?: number | null
          buffer_usage_percent?: number | null
          completed_bookings?: number | null
          created_at?: string | null
          date: string
          hour?: number | null
          id?: string
          institution_id: string
          missed_bookings?: number | null
          peak_load_time?: string | null
          service_id?: string | null
          total_footfall?: number | null
        }
        Update: {
          avg_wait_time_minutes?: number | null
          buffer_usage_percent?: number | null
          completed_bookings?: number | null
          created_at?: string | null
          date?: string
          hour?: number | null
          id?: string
          institution_id?: string
          missed_bookings?: number | null
          peak_load_time?: string | null
          service_id?: string | null
          total_footfall?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "institution_analytics_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_analytics_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          address: string
          category: string
          city: string
          created_at: string | null
          crowd_level: Database["public"]["Enums"]["crowd_level"] | null
          id: string
          is_active: boolean | null
          latitude: number
          longitude: number
          name: string
          operating_hours: Json | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          category: string
          city: string
          created_at?: string | null
          crowd_level?: Database["public"]["Enums"]["crowd_level"] | null
          id?: string
          is_active?: boolean | null
          latitude: number
          longitude: number
          name: string
          operating_hours?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          category?: string
          city?: string
          created_at?: string | null
          crowd_level?: Database["public"]["Enums"]["crowd_level"] | null
          id?: string
          is_active?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          operating_hours?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          avg_service_time_minutes: number | null
          buffer_threshold: number | null
          buffered_count: number | null
          category: string
          created_at: string | null
          current_inflow: number | null
          id: string
          institution_id: string
          name: string
          normal_capacity: number | null
          status: Database["public"]["Enums"]["service_status"] | null
          subcategory: string | null
          surge_threshold: number | null
          updated_at: string | null
        }
        Insert: {
          avg_service_time_minutes?: number | null
          buffer_threshold?: number | null
          buffered_count?: number | null
          category: string
          created_at?: string | null
          current_inflow?: number | null
          id?: string
          institution_id: string
          name: string
          normal_capacity?: number | null
          status?: Database["public"]["Enums"]["service_status"] | null
          subcategory?: string | null
          surge_threshold?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_service_time_minutes?: number | null
          buffer_threshold?: number | null
          buffered_count?: number | null
          category?: string
          created_at?: string | null
          current_inflow?: number | null
          id?: string
          institution_id?: string
          name?: string
          normal_capacity?: number | null
          status?: Database["public"]["Enums"]["service_status"] | null
          subcategory?: string | null
          surge_threshold?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          assigned_service_id: string | null
          created_at: string | null
          id: string
          institution_id: string
          is_available: boolean | null
          name: string
          role: Database["public"]["Enums"]["staff_role"] | null
          shift_end: string | null
          shift_start: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_service_id?: string | null
          created_at?: string | null
          id?: string
          institution_id: string
          is_available?: boolean | null
          name: string
          role?: Database["public"]["Enums"]["staff_role"] | null
          shift_end?: string | null
          shift_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_service_id?: string | null
          created_at?: string | null
          id?: string
          institution_id?: string
          is_available?: boolean | null
          name?: string
          role?: Database["public"]["Enums"]["staff_role"] | null
          shift_end?: string | null
          shift_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_assigned_service_id_fkey"
            columns: ["assigned_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string | null
          end_time: string | null
          from_service_id: string | null
          id: string
          reason: string | null
          staff_id: string
          start_time: string | null
          to_service_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string | null
          end_time?: string | null
          from_service_id?: string | null
          id?: string
          reason?: string | null
          staff_id: string
          start_time?: string | null
          to_service_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string | null
          end_time?: string | null
          from_service_id?: string | null
          id?: string
          reason?: string | null
          staff_id?: string
          start_time?: string | null
          to_service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_assignments_from_service_id_fkey"
            columns: ["from_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_assignments_to_service_id_fkey"
            columns: ["to_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "checked_in"
        | "completed"
        | "cancelled"
        | "snoozed"
      crowd_level: "low" | "moderate" | "high" | "surge"
      service_status: "active" | "paused" | "surge" | "closed"
      staff_role: "manager" | "operator" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "checked_in",
        "completed",
        "cancelled",
        "snoozed",
      ],
      crowd_level: ["low", "moderate", "high", "surge"],
      service_status: ["active", "paused", "surge", "closed"],
      staff_role: ["manager", "operator", "staff"],
    },
  },
} as const
