import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  id: string;
  site_name: string;
  site_tagline: string | null;
  site_description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  default_language: string;
  supported_languages: string[];
  social_facebook: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_twitter: string | null;
  google_analytics_id: string | null;
  meta_keywords: string[] | null;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async (): Promise<SiteSettings | null> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useWhatsAppSettings = () => {
  return useQuery({
    queryKey: ['whatsapp-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_public_whatsapp_settings');

      if (error) {
        console.error('Error fetching WhatsApp settings:', error);
        throw error;
      }

      return data?.[0] ?? null;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useNavigation = () => {
  return useQuery({
    queryKey: ['navigation-menu'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation_menu')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching navigation:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_variants (*),
          product_faqs (*)
        `)
        .eq('is_published', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useFaqs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching FAQs:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCertifications = () => {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching certifications:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
