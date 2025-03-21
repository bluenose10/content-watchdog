export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      plans: {
        Row: {
          created_at: string | null
          id: string
          monitoring_limit: number
          name: string
          price: number
          result_limit: number
          search_limit: number
        }
        Insert: {
          created_at?: string | null
          id: string
          monitoring_limit: number
          name: string
          price: number
          result_limit: number
          search_limit: number
        }
        Update: {
          created_at?: string | null
          id?: string
          monitoring_limit?: number
          name?: string
          price?: number
          result_limit?: number
          search_limit?: number
        }
        Relationships: []
      }
      search_metrics: {
        Row: {
          cache_hit: boolean
          created_at: string | null
          execution_time_ms: number
          id: number
          query_type: string
          result_count: number
        }
        Insert: {
          cache_hit?: boolean
          created_at?: string | null
          execution_time_ms: number
          id?: number
          query_type: string
          result_count: number
        }
        Update: {
          cache_hit?: boolean
          created_at?: string | null
          execution_time_ms?: number
          id?: number
          query_type?: string
          result_count?: number
        }
        Relationships: []
      }
      search_queries: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          last_run: string | null
          query_text: string | null
          query_type: string
          schedule_interval: string | null
          scheduled: boolean | null
          search_params_json: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          last_run?: string | null
          query_text?: string | null
          query_type: string
          schedule_interval?: string | null
          scheduled?: boolean | null
          search_params_json?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          last_run?: string | null
          query_text?: string | null
          query_type?: string
          schedule_interval?: string | null
          scheduled?: boolean | null
          search_params_json?: string | null
          user_id?: string
        }
        Relationships: []
      }
      search_results: {
        Row: {
          created_at: string | null
          found_at: string
          id: string
          match_level: string
          relevance_score: number | null
          search_id: string
          similarity_score: number | null
          source: string
          thumbnail: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          found_at: string
          id?: string
          match_level: string
          relevance_score?: number | null
          search_id: string
          similarity_score?: number | null
          source: string
          thumbnail: string
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          found_at?: string
          id?: string
          match_level?: string
          relevance_score?: number | null
          search_id?: string
          similarity_score?: number | null
          source?: string
          thumbnail?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_results_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "search_queries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string
          id: string
          plan_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end: string
          id?: string
          plan_id: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string
          id?: string
          plan_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      popular_searches: {
        Row: {
          query_text: string | null
          query_type: string | null
          search_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      direct_insert_search_query: {
        Args: {
          p_user_id: string
          p_query_type: string
          p_query_text: string
          p_search_params_json: string
        }
        Returns: Json
      }
      insert_plagiarism_query: {
        Args: {
          p_user_id: string
          p_query_text: string
          p_search_params: Json
        }
        Returns: Json
      }
      insert_search_query: {
        Args: {
          p_user_id: string
          p_query_type: string
          p_query_text: string
          p_search_params_json?: string
          p_image_url?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
