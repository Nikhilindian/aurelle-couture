export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          phone: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          recipient_name: string;
          phone: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipient_name: string;
          phone: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipient_name?: string;
          phone?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string;
          category: string;
          category_slug: string;
          fabric: string;
          craft: string;
          status: "active" | "draft" | "archived";
          seo_title: string | null;
          seo_description: string | null;
          is_new_arrival: boolean;
          is_bestseller: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          description: string;
          category: string;
          category_slug: string;
          fabric: string;
          craft: string;
          status?: "active" | "draft" | "archived";
          seo_title?: string | null;
          seo_description?: string | null;
          is_new_arrival?: boolean;
          is_bestseller?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          description?: string;
          category?: string;
          category_slug?: string;
          fabric?: string;
          craft?: string;
          status?: "active" | "draft" | "archived";
          seo_title?: string | null;
          seo_description?: string | null;
          is_new_arrival?: boolean;
          is_bestseller?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          size: string;
          color_name: string;
          color_hex: string;
          price_paise: number;
          compare_at_paise: number | null;
          stock_quantity: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          size: string;
          color_name: string;
          color_hex: string;
          price_paise: number;
          compare_at_paise?: number | null;
          stock_quantity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          size?: string;
          color_name?: string;
          color_hex?: string;
          price_paise?: number;
          compare_at_paise?: number | null;
          stock_quantity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          public_order_number: string;
          user_id: string | null;
          guest_email: string | null;
          guest_phone: string | null;
          currency: string;
          subtotal_paise: number;
          shipping_paise: number;
          discount_paise: number;
          total_paise: number;
          payment_method: "COD" | "RAZORPAY";
          payment_status: "pending" | "paid" | "failed" | "refunded";
          fulfillment_status: "unfulfilled" | "processing" | "shipped" | "delivered" | "cancelled";
          shipping_address_snapshot: Json;
          coupon_code_snapshot: string | null;
          cancellation_reason: string | null;
          idempotency_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          public_order_number: string;
          user_id?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          currency?: string;
          subtotal_paise: number;
          shipping_paise?: number;
          discount_paise?: number;
          total_paise: number;
          payment_method: "COD" | "RAZORPAY";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          fulfillment_status?: "unfulfilled" | "processing" | "shipped" | "delivered" | "cancelled";
          shipping_address_snapshot: Json;
          coupon_code_snapshot?: string | null;
          cancellation_reason?: string | null;
          idempotency_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          public_order_number?: string;
          user_id?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          currency?: string;
          subtotal_paise?: number;
          shipping_paise?: number;
          discount_paise?: number;
          total_paise?: number;
          payment_method?: "COD" | "RAZORPAY";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          fulfillment_status?: "unfulfilled" | "processing" | "shipped" | "delivered" | "cancelled";
          shipping_address_snapshot?: Json;
          coupon_code_snapshot?: string | null;
          cancellation_reason?: string | null;
          idempotency_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: "percentage" | "fixed_amount";
          discount_value: number;
          min_order_paise: number;
          max_discount_paise: number | null;
          usage_limit: number | null;
          used_count: number;
          valid_from: string;
          valid_until: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: "percentage" | "fixed_amount";
          discount_value: number;
          min_order_paise?: number;
          max_discount_paise?: number | null;
          usage_limit?: number | null;
          used_count?: number;
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: "percentage" | "fixed_amount";
          discount_value?: number;
          min_order_paise?: number;
          max_discount_paise?: number | null;
          usage_limit?: number | null;
          used_count?: number;
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string | null;
          anonymous_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          anonymous_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          anonymous_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          variant_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          variant_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          variant_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          title_snapshot: string;
          sku_snapshot: string;
          color_snapshot: string;
          size_snapshot: string;
          price_paise_snapshot: number;
          quantity: number;
          image_snapshot: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          title_snapshot: string;
          sku_snapshot: string;
          color_snapshot: string;
          size_snapshot: string;
          price_paise_snapshot: number;
          quantity: number;
          image_snapshot?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          title_snapshot?: string;
          sku_snapshot?: string;
          color_snapshot?: string;
          size_snapshot?: string;
          price_paise_snapshot?: number;
          quantity?: number;
          image_snapshot?: string | null;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          provider: "razorpay" | "cod";
          provider_order_id: string | null;
          provider_payment_id: string | null;
          amount_paise: number;
          currency: string;
          status: "created" | "authorized" | "captured" | "failed" | "refunded";
          signature_verified: boolean;
          webhook_event_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          provider: "razorpay" | "cod";
          provider_order_id?: string | null;
          provider_payment_id?: string | null;
          amount_paise: number;
          currency?: string;
          status: "created" | "authorized" | "captured" | "failed" | "refunded";
          signature_verified?: boolean;
          webhook_event_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          provider?: "razorpay" | "cod";
          provider_order_id?: string | null;
          provider_payment_id?: string | null;
          amount_paise?: number;
          currency?: string;
          status?: "created" | "authorized" | "captured" | "failed" | "refunded";
          signature_verified?: boolean;
          webhook_event_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
