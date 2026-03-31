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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          file_url: string | null
          id: string
          job_id: string
          metadata: Json | null
          type: string
        }
        Insert: {
          file_url?: string | null
          id?: string
          job_id: string
          metadata?: Json | null
          type: string
        }
        Update: {
          file_url?: string | null
          id?: string
          job_id?: string
          metadata?: Json | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_profiles: {
        Row: {
          brand_brain: string | null
          created_at: string | null
          dark_bg: string
          font: string
          handle: string
          id: string
          light_bg: string
          logo_url: string | null
          name: string
          primary_color: string
          primary_dark: string
          primary_light: string
          tone: string
        }
        Insert: {
          brand_brain?: string | null
          created_at?: string | null
          dark_bg?: string
          font?: string
          handle: string
          id?: string
          light_bg?: string
          logo_url?: string | null
          name: string
          primary_color?: string
          primary_dark?: string
          primary_light?: string
          tone?: string
        }
        Update: {
          brand_brain?: string | null
          created_at?: string | null
          dark_bg?: string
          font?: string
          handle?: string
          id?: string
          light_bg?: string
          logo_url?: string | null
          name?: string
          primary_color?: string
          primary_dark?: string
          primary_light?: string
          tone?: string
        }
        Relationships: []
      }
      carousels: {
        Row: {
          brand_id: string | null
          caption: string | null
          created_at: string | null
          hashtags: string[] | null
          hook: string | null
          html: string | null
          id: string
          pillar: string | null
          slides: Json
          status: string
          topic: string
        }
        Insert: {
          brand_id?: string | null
          caption?: string | null
          created_at?: string | null
          hashtags?: string[] | null
          hook?: string | null
          html?: string | null
          id?: string
          pillar?: string | null
          slides?: Json
          status?: string
          topic: string
        }
        Update: {
          brand_id?: string | null
          caption?: string | null
          created_at?: string | null
          hashtags?: string[] | null
          hook?: string | null
          html?: string | null
          id?: string
          pillar?: string | null
          slides?: Json
          status?: string
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "carousels_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      iterations: {
        Row: {
          created_at: string
          id: string
          input: Json
          job_id: string
          output: Json
          worker: string
        }
        Insert: {
          created_at?: string
          id?: string
          input?: Json
          job_id: string
          output?: Json
          worker: string
        }
        Update: {
          created_at?: string
          id?: string
          input?: Json
          job_id?: string
          output?: Json
          worker?: string
        }
        Relationships: [
          {
            foreignKeyName: "iterations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          airtable_record_id: string | null
          calendar_date: string | null
          created_at: string
          error_message: string | null
          id: string
          iteration_number: number
          status: string
          topic: string
        }
        Insert: {
          airtable_record_id?: string | null
          calendar_date?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          iteration_number?: number
          status?: string
          topic: string
        }
        Update: {
          airtable_record_id?: string | null
          calendar_date?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          iteration_number?: number
          status?: string
          topic?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          extracted_data: Json | null
          id: string
          pitch_strategy: Json | null
          raw_text: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          extracted_data?: Json | null
          id?: string
          pitch_strategy?: Json | null
          raw_text?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          extracted_data?: Json | null
          id?: string
          pitch_strategy?: Json | null
          raw_text?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      ready_queue: {
        Row: {
          id: string
          job_id: string
          platform: string
          posted_at: string | null
          scheduled_for: string
        }
        Insert: {
          id?: string
          job_id: string
          platform?: string
          posted_at?: string | null
          scheduled_for: string
        }
        Update: {
          id?: string
          job_id?: string
          platform?: string
          posted_at?: string | null
          scheduled_for?: string
        }
        Relationships: [
          {
            foreignKeyName: "ready_queue_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
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
      lead_status: "new" | "pitched" | "follow_up" | "closed" | "lost"
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
      lead_status: ["new", "pitched", "follow_up", "closed", "lost"],
    },
  },
} as const

// Convenience types for the leads table
export type Lead = Tables<"leads">
export type LeadInsert = TablesInsert<"leads">
export type LeadUpdate = TablesUpdate<"leads">
export type LeadStatus = Enums<"lead_status">
