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
      aggregate_analytics: {
        Row: {
          analytics_date: string
          avg_discount_rate: number | null
          created_at: string
          female_revenue_ratio: number | null
          id: string
          metro_non_metro_ratio: number | null
          persona_segment_weights: Json | null
          premium_segment_share: number | null
          price_elasticity_distribution: Json | null
          regional_style_divergence: Json | null
          tenant_id: string
          top_channel_breakdown: Json | null
          top_personas_by_revenue: Json | null
          total_online_ratio: number | null
        }
        Insert: {
          analytics_date?: string
          avg_discount_rate?: number | null
          created_at?: string
          female_revenue_ratio?: number | null
          id?: string
          metro_non_metro_ratio?: number | null
          persona_segment_weights?: Json | null
          premium_segment_share?: number | null
          price_elasticity_distribution?: Json | null
          regional_style_divergence?: Json | null
          tenant_id: string
          top_channel_breakdown?: Json | null
          top_personas_by_revenue?: Json | null
          total_online_ratio?: number | null
        }
        Update: {
          analytics_date?: string
          avg_discount_rate?: number | null
          created_at?: string
          female_revenue_ratio?: number | null
          id?: string
          metro_non_metro_ratio?: number | null
          persona_segment_weights?: Json | null
          premium_segment_share?: number | null
          price_elasticity_distribution?: Json | null
          regional_style_divergence?: Json | null
          tenant_id?: string
          top_channel_breakdown?: Json | null
          top_personas_by_revenue?: Json | null
          total_online_ratio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aggregate_analytics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_history: {
        Row: {
          action_type: string
          created_at: string
          id: string
          input_data: Json | null
          product_id: string | null
          results_summary: Json | null
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          input_data?: Json | null
          product_id?: string | null
          results_summary?: Json | null
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          input_data?: Json | null
          product_id?: string | null
          results_summary?: Json | null
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_history_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_results: {
        Row: {
          confidence_score: number | null
          created_at: string
          explanation: string | null
          id: string
          like_probability: number
          match_factors: Json | null
          persona_id: string
          price_ceiling: number | null
          price_elasticity: number | null
          price_floor: number | null
          price_sweet_spot: number | null
          product_id: string
          tenant_id: string
          what_if_simulations: Json | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          explanation?: string | null
          id?: string
          like_probability: number
          match_factors?: Json | null
          persona_id: string
          price_ceiling?: number | null
          price_elasticity?: number | null
          price_floor?: number | null
          price_sweet_spot?: number | null
          product_id: string
          tenant_id: string
          what_if_simulations?: Json | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          explanation?: string | null
          id?: string
          like_probability?: number
          match_factors?: Json | null
          persona_id?: string
          price_ceiling?: number | null
          price_elasticity?: number | null
          price_floor?: number | null
          price_sweet_spot?: number | null
          product_id?: string
          tenant_id?: string
          what_if_simulations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_results_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_results_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_snapshots: {
        Row: {
          created_at: string
          id: string
          metrics: Json
          snapshot_date: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json
          snapshot_date?: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json
          snapshot_date?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_snapshots_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      persona_analytics: {
        Row: {
          above_median_purchase_pct: number | null
          analytics_date: string
          avg_discount_availed: number | null
          avg_lifetime_value: number | null
          browse_to_cart_ratio: number | null
          cart_to_purchase_ratio: number | null
          category_contributions: Json | null
          category_frequency: Json | null
          classic_trendy_ratio: number | null
          created_at: string
          cross_category_adoption: number | null
          full_price_discount_ratio: number | null
          id: string
          marketplace_brand_ratio: number | null
          mobile_desktop_ratio: number | null
          neutral_color_bold_ratio: number | null
          online_offline_ratio: number | null
          persona_id: string | null
          price_elasticity_segment: string | null
          repeat_purchase_rate: number | null
          return_rate: number | null
          solid_prints_ratio: number | null
          tenant_id: string
          wishlist_to_purchase_ratio: number | null
        }
        Insert: {
          above_median_purchase_pct?: number | null
          analytics_date?: string
          avg_discount_availed?: number | null
          avg_lifetime_value?: number | null
          browse_to_cart_ratio?: number | null
          cart_to_purchase_ratio?: number | null
          category_contributions?: Json | null
          category_frequency?: Json | null
          classic_trendy_ratio?: number | null
          created_at?: string
          cross_category_adoption?: number | null
          full_price_discount_ratio?: number | null
          id?: string
          marketplace_brand_ratio?: number | null
          mobile_desktop_ratio?: number | null
          neutral_color_bold_ratio?: number | null
          online_offline_ratio?: number | null
          persona_id?: string | null
          price_elasticity_segment?: string | null
          repeat_purchase_rate?: number | null
          return_rate?: number | null
          solid_prints_ratio?: number | null
          tenant_id: string
          wishlist_to_purchase_ratio?: number | null
        }
        Update: {
          above_median_purchase_pct?: number | null
          analytics_date?: string
          avg_discount_availed?: number | null
          avg_lifetime_value?: number | null
          browse_to_cart_ratio?: number | null
          cart_to_purchase_ratio?: number | null
          category_contributions?: Json | null
          category_frequency?: Json | null
          classic_trendy_ratio?: number | null
          created_at?: string
          cross_category_adoption?: number | null
          full_price_discount_ratio?: number | null
          id?: string
          marketplace_brand_ratio?: number | null
          mobile_desktop_ratio?: number | null
          neutral_color_bold_ratio?: number | null
          online_offline_ratio?: number | null
          persona_id?: string | null
          price_elasticity_segment?: string | null
          repeat_purchase_rate?: number | null
          return_rate?: number | null
          solid_prints_ratio?: number | null
          tenant_id?: string
          wishlist_to_purchase_ratio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "persona_analytics_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_analytics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          attribute_vector: Json
          avatar_emoji: string | null
          brand_psychology: Json
          category_affinities: Json | null
          created_at: string
          demographics: Json
          description: string | null
          digital_behavior: Json | null
          fashion_orientation: Json | null
          gender: string | null
          id: string
          is_active: boolean | null
          lifestyle: Json | null
          name: string
          price_behavior: Json
          product_preferences: Json
          psychographics: Json
          segment_code: string | null
          segment_name: string | null
          segment_weight: number | null
          shopping_preferences: Json
          tenant_id: string
          updated_at: string
        }
        Insert: {
          attribute_vector?: Json
          avatar_emoji?: string | null
          brand_psychology?: Json
          category_affinities?: Json | null
          created_at?: string
          demographics?: Json
          description?: string | null
          digital_behavior?: Json | null
          fashion_orientation?: Json | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          lifestyle?: Json | null
          name: string
          price_behavior?: Json
          product_preferences?: Json
          psychographics?: Json
          segment_code?: string | null
          segment_name?: string | null
          segment_weight?: number | null
          shopping_preferences?: Json
          tenant_id: string
          updated_at?: string
        }
        Update: {
          attribute_vector?: Json
          avatar_emoji?: string | null
          brand_psychology?: Json
          category_affinities?: Json | null
          created_at?: string
          demographics?: Json
          description?: string | null
          digital_behavior?: Json | null
          fashion_orientation?: Json | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          lifestyle?: Json | null
          name?: string
          price_behavior?: Json
          product_preferences?: Json
          psychographics?: Json
          segment_code?: string | null
          segment_name?: string | null
          segment_weight?: number | null
          shopping_preferences?: Json
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "personas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_style_mappings: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          product_id: string
          style_cluster_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          product_id: string
          style_cluster_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          product_id?: string
          style_cluster_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_style_mappings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_style_mappings_style_cluster_id_fkey"
            columns: ["style_cluster_id"]
            isOneToOne: false
            referencedRelation: "style_clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: string[] | null
          brand: string | null
          category: string
          created_at: string
          currency: string | null
          description: string | null
          extracted_features: Json | null
          feature_vector: Json | null
          id: string
          name: string
          original_price: number | null
          price: number
          primary_image_url: string | null
          size_range: string[] | null
          sku: string | null
          status: string | null
          subcategory: string | null
          tags: string[] | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          additional_images?: string[] | null
          brand?: string | null
          category: string
          created_at?: string
          currency?: string | null
          description?: string | null
          extracted_features?: Json | null
          feature_vector?: Json | null
          id?: string
          name: string
          original_price?: number | null
          price: number
          primary_image_url?: string | null
          size_range?: string[] | null
          sku?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          additional_images?: string[] | null
          brand?: string | null
          category?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          extracted_features?: Json | null
          feature_vector?: Json | null
          id?: string
          name?: string
          original_price?: number | null
          price?: number
          primary_image_url?: string | null
          size_range?: string[] | null
          sku?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_tenant_id: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_tenant_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_tenant_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_tenant_id_fkey"
            columns: ["current_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      style_clusters: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          keywords: string[] | null
          name: string
          tenant_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string[] | null
          name: string
          tenant_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string[] | null
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "style_clusters_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _tenant_id: string
          _user_id: string
        }
        Returns: boolean
      }
      has_tenant_access: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "merchandiser" | "marketer" | "viewer"
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
      app_role: ["admin", "merchandiser", "marketer", "viewer"],
    },
  },
} as const
