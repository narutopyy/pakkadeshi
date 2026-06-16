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
      ai_chatbot_settings: {
        Row: {
          created_at: string
          fallback_message: string | null
          fallback_message_hi: string | null
          greeting_message: string | null
          greeting_message_hi: string | null
          id: string
          is_enabled: boolean | null
          max_tokens: number | null
          system_prompt: string | null
          temperature: number | null
          tone: Database["public"]["Enums"]["ai_tone"] | null
          updated_at: string
          whatsapp_cta_enabled: boolean | null
          whatsapp_cta_text: string | null
          whatsapp_cta_text_hi: string | null
        }
        Insert: {
          created_at?: string
          fallback_message?: string | null
          fallback_message_hi?: string | null
          greeting_message?: string | null
          greeting_message_hi?: string | null
          id?: string
          is_enabled?: boolean | null
          max_tokens?: number | null
          system_prompt?: string | null
          temperature?: number | null
          tone?: Database["public"]["Enums"]["ai_tone"] | null
          updated_at?: string
          whatsapp_cta_enabled?: boolean | null
          whatsapp_cta_text?: string | null
          whatsapp_cta_text_hi?: string | null
        }
        Update: {
          created_at?: string
          fallback_message?: string | null
          fallback_message_hi?: string | null
          greeting_message?: string | null
          greeting_message_hi?: string | null
          id?: string
          is_enabled?: boolean | null
          max_tokens?: number | null
          system_prompt?: string | null
          temperature?: number | null
          tone?: Database["public"]["Enums"]["ai_tone"] | null
          updated_at?: string
          whatsapp_cta_enabled?: boolean | null
          whatsapp_cta_text?: string | null
          whatsapp_cta_text_hi?: string | null
        }
        Relationships: []
      }
      ai_knowledge_base: {
        Row: {
          category: string | null
          content: string
          content_hi: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          priority: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          content_hi?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          priority?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          content_hi?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          priority?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          description_hi: string | null
          id: string
          name: string
          name_hi: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_hi?: string | null
          id?: string
          name: string
          name_hi?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          description_hi?: string | null
          id?: string
          name?: string
          name_hi?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string | null
          content_hi: string | null
          created_at: string
          excerpt: string | null
          excerpt_hi: string | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          published_at: string | null
          scheduled_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          title_hi: string | null
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          content_hi?: string | null
          created_at?: string
          excerpt?: string | null
          excerpt_hi?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          title_hi?: string | null
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          content_hi?: string | null
          created_at?: string
          excerpt?: string | null
          excerpt_hi?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          title_hi?: string | null
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          certificate_number: string | null
          certificate_url: string | null
          created_at: string
          id: string
          is_visible: boolean | null
          issuing_authority: string | null
          logo_url: string | null
          name: string
          name_hi: string | null
          sort_order: number | null
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          certificate_number?: string | null
          certificate_url?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          issuing_authority?: string | null
          logo_url?: string | null
          name: string
          name_hi?: string | null
          sort_order?: number | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          certificate_number?: string | null
          certificate_url?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          issuing_authority?: string | null
          logo_url?: string | null
          name?: string
          name_hi?: string | null
          sort_order?: number | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      chat_logs: {
        Row: {
          ai_response: string | null
          created_at: string
          id: string
          language: string | null
          response_time_ms: number | null
          session_id: string
          tokens_used: number | null
          user_agent: string | null
          user_ip: string | null
          user_message: string
          whatsapp_clicked: boolean | null
        }
        Insert: {
          ai_response?: string | null
          created_at?: string
          id?: string
          language?: string | null
          response_time_ms?: number | null
          session_id: string
          tokens_used?: number | null
          user_agent?: string | null
          user_ip?: string | null
          user_message: string
          whatsapp_clicked?: boolean | null
        }
        Update: {
          ai_response?: string | null
          created_at?: string
          id?: string
          language?: string | null
          response_time_ms?: number | null
          session_id?: string
          tokens_used?: number | null
          user_agent?: string | null
          user_ip?: string | null
          user_message?: string
          whatsapp_clicked?: boolean | null
        }
        Relationships: []
      }
      distributors: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          contact_person: string
          created_at: string
          email: string | null
          expected_quantity: string | null
          gst_number: string | null
          id: string
          is_approved: boolean | null
          message: string | null
          notes: string | null
          phone: string
          pincode: string | null
          state: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          contact_person: string
          created_at?: string
          email?: string | null
          expected_quantity?: string | null
          gst_number?: string | null
          id?: string
          is_approved?: boolean | null
          message?: string | null
          notes?: string | null
          phone: string
          pincode?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string | null
          expected_quantity?: string | null
          gst_number?: string | null
          id?: string
          is_approved?: boolean | null
          message?: string | null
          notes?: string | null
          phone?: string
          pincode?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string
          email: string | null
          enquiry_type: string | null
          id: string
          is_read: boolean | null
          is_replied: boolean | null
          message: string
          name: string
          notes: string | null
          phone: string | null
          replied_at: string | null
          source: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          enquiry_type?: string | null
          id?: string
          is_read?: boolean | null
          is_replied?: boolean | null
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          replied_at?: string | null
          source?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          enquiry_type?: string | null
          id?: string
          is_read?: boolean | null
          is_replied?: boolean | null
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          replied_at?: string | null
          source?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          answer_hi: string | null
          category: string | null
          created_at: string
          id: string
          is_published: boolean | null
          question: string
          question_hi: string | null
          sort_order: number | null
        }
        Insert: {
          answer: string
          answer_hi?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          question: string
          question_hi?: string | null
          sort_order?: number | null
        }
        Update: {
          answer?: string
          answer_hi?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          question?: string
          question_hi?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          alt_text_hi: string | null
          caption: string | null
          caption_hi: string | null
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          folder: string | null
          id: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          alt_text_hi?: string | null
          caption?: string | null
          caption_hi?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          folder?: string | null
          id?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          alt_text_hi?: string | null
          caption?: string | null
          caption_hi?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          folder?: string | null
          id?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      navigation_menu: {
        Row: {
          created_at: string
          id: string
          is_external: boolean | null
          is_visible: boolean | null
          label: string
          label_hi: string | null
          parent_id: string | null
          sort_order: number | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_external?: boolean | null
          is_visible?: boolean | null
          label: string
          label_hi?: string | null
          parent_id?: string | null
          sort_order?: number | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_external?: boolean | null
          is_visible?: boolean | null
          label?: string
          label_hi?: string | null
          parent_id?: string | null
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_menu_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_menu"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          background_color: string | null
          background_image_url: string | null
          content: Json | null
          content_hi: Json | null
          created_at: string
          id: string
          is_visible: boolean | null
          page_id: string
          section_type: Database["public"]["Enums"]["section_type"]
          sort_order: number | null
          subtitle: string | null
          subtitle_hi: string | null
          title: string | null
          title_hi: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          background_image_url?: string | null
          content?: Json | null
          content_hi?: Json | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          page_id: string
          section_type: Database["public"]["Enums"]["section_type"]
          sort_order?: number | null
          subtitle?: string | null
          subtitle_hi?: string | null
          title?: string | null
          title_hi?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          background_image_url?: string | null
          content?: Json | null
          content_hi?: Json | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          page_id?: string
          section_type?: Database["public"]["Enums"]["section_type"]
          sort_order?: number | null
          subtitle?: string | null
          subtitle_hi?: string | null
          title?: string | null
          title_hi?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_homepage: boolean | null
          is_published: boolean | null
          meta_description: string | null
          meta_description_hi: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          meta_title_hi: string | null
          nav_order: number | null
          og_image_url: string | null
          show_in_nav: boolean | null
          slug: string
          title: string
          title_hi: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_homepage?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_description_hi?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          meta_title_hi?: string | null
          nav_order?: number | null
          og_image_url?: string | null
          show_in_nav?: boolean | null
          slug: string
          title: string
          title_hi?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_homepage?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_description_hi?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          meta_title_hi?: string | null
          nav_order?: number | null
          og_image_url?: string | null
          show_in_nav?: boolean | null
          slug?: string
          title?: string
          title_hi?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      product_faqs: {
        Row: {
          answer: string
          answer_hi: string | null
          created_at: string
          id: string
          product_id: string
          question: string
          question_hi: string | null
          sort_order: number | null
        }
        Insert: {
          answer: string
          answer_hi?: string | null
          created_at?: string
          id?: string
          product_id: string
          question: string
          question_hi?: string | null
          sort_order?: number | null
        }
        Update: {
          answer?: string
          answer_hi?: string | null
          created_at?: string
          id?: string
          product_id?: string
          question?: string
          question_hi?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_faqs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          discount_price: number | null
          id: string
          is_available: boolean | null
          name: string
          name_hi: string | null
          price: number
          product_id: string
          size: string | null
          sku: string | null
          sort_order: number | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_price?: number | null
          id?: string
          is_available?: boolean | null
          name: string
          name_hi?: string | null
          price: number
          product_id: string
          size?: string | null
          sku?: string | null
          sort_order?: number | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_price?: number | null
          id?: string
          is_available?: boolean | null
          name?: string
          name_hi?: string | null
          price?: number
          product_id?: string
          size?: string | null
          sku?: string | null
          sort_order?: number | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number | null
          created_at: string
          currency: string | null
          discount_price: number | null
          full_description: string | null
          full_description_hi: string | null
          id: string
          images: string[] | null
          is_available: boolean | null
          is_featured: boolean | null
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          name_hi: string | null
          short_description: string | null
          short_description_hi: string | null
          slug: string
          sort_order: number | null
          updated_at: string
          whatsapp_message: string | null
          whatsapp_message_hi: string | null
        }
        Insert: {
          base_price?: number | null
          created_at?: string
          currency?: string | null
          discount_price?: number | null
          full_description?: string | null
          full_description_hi?: string | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          name_hi?: string | null
          short_description?: string | null
          short_description_hi?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
          whatsapp_message?: string | null
          whatsapp_message_hi?: string | null
        }
        Update: {
          base_price?: number | null
          created_at?: string
          currency?: string | null
          discount_price?: number | null
          full_description?: string | null
          full_description_hi?: string | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          name_hi?: string | null
          short_description?: string | null
          short_description_hi?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
          whatsapp_message?: string | null
          whatsapp_message_hi?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string | null
          created_at: string
          default_language: string | null
          favicon_url: string | null
          google_analytics_id: string | null
          id: string
          logo_url: string | null
          meta_keywords: string[] | null
          primary_color: string | null
          secondary_color: string | null
          site_description: string | null
          site_name: string
          site_tagline: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_twitter: string | null
          social_youtube: string | null
          supported_languages: string[] | null
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string
          default_language?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          id?: string
          logo_url?: string | null
          meta_keywords?: string[] | null
          primary_color?: string | null
          secondary_color?: string | null
          site_description?: string | null
          site_name?: string
          site_tagline?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          supported_languages?: string[] | null
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string
          default_language?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          id?: string
          logo_url?: string | null
          meta_keywords?: string[] | null
          primary_color?: string | null
          secondary_color?: string | null
          site_description?: string | null
          site_name?: string
          site_tagline?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          supported_languages?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          content: string
          content_hi: string | null
          created_at: string
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          location: string | null
          location_hi: string | null
          name: string
          name_hi: string | null
          rating: number | null
          sort_order: number | null
        }
        Insert: {
          avatar_url?: string | null
          content: string
          content_hi?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          location?: string | null
          location_hi?: string | null
          name: string
          name_hi?: string | null
          rating?: number | null
          sort_order?: number | null
        }
        Update: {
          avatar_url?: string | null
          content?: string
          content_hi?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          location?: string | null
          location_hi?: string | null
          name?: string
          name_hi?: string | null
          rating?: number | null
          sort_order?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          description_hi: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          sort_order: number | null
          thumbnail_url: string | null
          title: string
          title_hi: string | null
          updated_at: string
          views_count: number | null
          youtube_id: string | null
          youtube_url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          description_hi?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title: string
          title_hi?: string | null
          updated_at?: string
          views_count?: number | null
          youtube_id?: string | null
          youtube_url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          description_hi?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title?: string
          title_hi?: string | null
          updated_at?: string
          views_count?: number | null
          youtube_id?: string | null
          youtube_url?: string
        }
        Relationships: []
      }
      whatsapp_settings: {
        Row: {
          bulk_order_message: string | null
          bulk_order_message_hi: string | null
          button_position: string | null
          created_at: string
          default_message: string | null
          default_message_hi: string | null
          distributor_message: string | null
          distributor_message_hi: string | null
          id: string
          is_enabled: boolean | null
          phone_number: string
          product_inquiry_message: string | null
          product_inquiry_message_hi: string | null
          show_floating_button: boolean | null
          updated_at: string
        }
        Insert: {
          bulk_order_message?: string | null
          bulk_order_message_hi?: string | null
          button_position?: string | null
          created_at?: string
          default_message?: string | null
          default_message_hi?: string | null
          distributor_message?: string | null
          distributor_message_hi?: string | null
          id?: string
          is_enabled?: boolean | null
          phone_number: string
          product_inquiry_message?: string | null
          product_inquiry_message_hi?: string | null
          show_floating_button?: boolean | null
          updated_at?: string
        }
        Update: {
          bulk_order_message?: string | null
          bulk_order_message_hi?: string | null
          button_position?: string | null
          created_at?: string
          default_message?: string | null
          default_message_hi?: string | null
          distributor_message?: string | null
          distributor_message_hi?: string | null
          id?: string
          is_enabled?: boolean | null
          phone_number?: string
          product_inquiry_message?: string | null
          product_inquiry_message_hi?: string | null
          show_floating_button?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_chat_settings: {
        Args: never
        Returns: {
          greeting_message: string
          greeting_message_hi: string
          is_enabled: boolean
          whatsapp_cta_enabled: boolean
          whatsapp_cta_text: string
          whatsapp_cta_text_hi: string
        }[]
      }
      get_public_whatsapp_settings: {
        Args: never
        Returns: {
          bulk_order_message: string
          bulk_order_message_hi: string
          button_position: string
          default_message: string
          default_message_hi: string
          distributor_message: string
          distributor_message_hi: string
          is_enabled: boolean
          phone_number: string
          product_inquiry_message: string
          product_inquiry_message_hi: string
          show_floating_button: boolean
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      ai_tone: "desi" | "neutral" | "formal"
      app_role: "admin" | "editor" | "viewer"
      content_status: "draft" | "published" | "scheduled" | "archived"
      section_type:
        | "hero"
        | "text"
        | "image"
        | "image_text"
        | "video"
        | "faq"
        | "cta"
        | "products"
        | "testimonials"
        | "features"
        | "process"
        | "comparison"
        | "contact_form"
        | "custom"
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
      ai_tone: ["desi", "neutral", "formal"],
      app_role: ["admin", "editor", "viewer"],
      content_status: ["draft", "published", "scheduled", "archived"],
      section_type: [
        "hero",
        "text",
        "image",
        "image_text",
        "video",
        "faq",
        "cta",
        "products",
        "testimonials",
        "features",
        "process",
        "comparison",
        "contact_form",
        "custom",
      ],
    },
  },
} as const
