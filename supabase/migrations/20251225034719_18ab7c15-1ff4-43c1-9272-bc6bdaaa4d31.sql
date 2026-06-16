-- =============================================
-- PAKKA DESHI PRODUCTION DATABASE SCHEMA
-- =============================================

-- ENUM TYPES
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE public.section_type AS ENUM ('hero', 'text', 'image', 'image_text', 'video', 'faq', 'cta', 'products', 'testimonials', 'features', 'process', 'comparison', 'contact_form', 'custom');
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'scheduled', 'archived');
CREATE TYPE public.ai_tone AS ENUM ('desi', 'neutral', 'formal');

-- =============================================
-- 1. USER ROLES (Separate from profiles for security)
-- =============================================
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- RLS for user_roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view own role" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- 2. PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by authenticated" ON public.profiles
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 3. SITE SETTINGS (Global Configuration)
-- =============================================
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'Pakka Deshi',
    site_tagline TEXT DEFAULT 'Pure Cold-Pressed Mustard Oil',
    site_description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT DEFAULT '#D4A742',
    secondary_color TEXT DEFAULT '#4A3728',
    accent_color TEXT DEFAULT '#6B8E23',
    default_language TEXT DEFAULT 'en',
    supported_languages TEXT[] DEFAULT ARRAY['en', 'hi'],
    social_facebook TEXT,
    social_instagram TEXT,
    social_youtube TEXT,
    social_twitter TEXT,
    google_analytics_id TEXT,
    meta_keywords TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings" ON public.site_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 4. MEDIA LIBRARY
-- =============================================
CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    alt_text TEXT,
    alt_text_hi TEXT,
    caption TEXT,
    caption_hi TEXT,
    folder TEXT DEFAULT 'general',
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view media" ON public.media
FOR SELECT USING (true);

CREATE POLICY "Admins can manage media" ON public.media
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 5. PAGES (Dynamic Page Builder)
-- =============================================
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    title_hi TEXT,
    meta_title TEXT,
    meta_title_hi TEXT,
    meta_description TEXT,
    meta_description_hi TEXT,
    meta_keywords TEXT[],
    og_image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    is_homepage BOOLEAN DEFAULT false,
    show_in_nav BOOLEAN DEFAULT true,
    nav_order INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published pages" ON public.pages
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage pages" ON public.pages
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 6. PAGE SECTIONS (Reorderable Content Blocks)
-- =============================================
CREATE TABLE public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
    section_type section_type NOT NULL,
    title TEXT,
    title_hi TEXT,
    subtitle TEXT,
    subtitle_hi TEXT,
    content JSONB DEFAULT '{}',
    content_hi JSONB DEFAULT '{}',
    background_color TEXT,
    background_image_url TEXT,
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible sections" ON public.page_sections
FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage sections" ON public.page_sections
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 7. PRODUCTS
-- =============================================
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_hi TEXT,
    short_description TEXT,
    short_description_hi TEXT,
    full_description TEXT,
    full_description_hi TEXT,
    base_price DECIMAL(10,2),
    discount_price DECIMAL(10,2),
    currency TEXT DEFAULT 'INR',
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    whatsapp_message TEXT,
    whatsapp_message_hi TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published products" ON public.products
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage products" ON public.products
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 8. PRODUCT VARIANTS
-- =============================================
CREATE TABLE public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    name_hi TEXT,
    size TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    sku TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view variants" ON public.product_variants
FOR SELECT USING (true);

CREATE POLICY "Admins can manage variants" ON public.product_variants
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 9. PRODUCT FAQS
-- =============================================
CREATE TABLE public.product_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    question_hi TEXT,
    answer TEXT NOT NULL,
    answer_hi TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view FAQs" ON public.product_faqs
FOR SELECT USING (true);

CREATE POLICY "Admins can manage FAQs" ON public.product_faqs
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 10. BLOG CATEGORIES
-- =============================================
CREATE TABLE public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_hi TEXT,
    description TEXT,
    description_hi TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories" ON public.blog_categories
FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.blog_categories
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 11. BLOG POSTS
-- =============================================
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    title_hi TEXT,
    excerpt TEXT,
    excerpt_hi TEXT,
    content TEXT,
    content_hi TEXT,
    featured_image_url TEXT,
    category_id UUID REFERENCES public.blog_categories(id),
    author_id UUID REFERENCES auth.users(id),
    status content_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON public.blog_posts
FOR SELECT USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "Admins can manage posts" ON public.blog_posts
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 12. VIDEOS
-- =============================================
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_hi TEXT,
    description TEXT,
    description_hi TEXT,
    youtube_url TEXT NOT NULL,
    youtube_id TEXT,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'general',
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published videos" ON public.videos
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage videos" ON public.videos
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 13. CERTIFICATIONS (FSSAI, etc.)
-- =============================================
CREATE TABLE public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_hi TEXT,
    certificate_number TEXT,
    issuing_authority TEXT,
    certificate_url TEXT,
    logo_url TEXT,
    valid_from DATE,
    valid_until DATE,
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible certs" ON public.certifications
FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage certs" ON public.certifications
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 14. WHATSAPP SETTINGS
-- =============================================
CREATE TABLE public.whatsapp_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    default_message TEXT DEFAULT 'Hello! I am interested in Pakka Deshi mustard oil.',
    default_message_hi TEXT DEFAULT 'नमस्ते! मुझे पक्का देसी सरसों तेल में रुचि है।',
    product_inquiry_message TEXT DEFAULT 'Hi, I want to order {{product_name}}',
    product_inquiry_message_hi TEXT DEFAULT 'नमस्ते, मैं {{product_name}} ऑर्डर करना चाहता हूं',
    bulk_order_message TEXT DEFAULT 'Hi, I am interested in bulk orders.',
    bulk_order_message_hi TEXT DEFAULT 'नमस्ते, मुझे थोक ऑर्डर में रुचि है।',
    distributor_message TEXT DEFAULT 'Hi, I want to become a distributor.',
    distributor_message_hi TEXT DEFAULT 'नमस्ते, मैं डिस्ट्रीब्यूटर बनना चाहता हूं।',
    show_floating_button BOOLEAN DEFAULT true,
    button_position TEXT DEFAULT 'bottom-right',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read WhatsApp settings" ON public.whatsapp_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage WhatsApp settings" ON public.whatsapp_settings
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 15. AI CHATBOT SETTINGS
-- =============================================
CREATE TABLE public.ai_chatbot_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_enabled BOOLEAN DEFAULT true,
    system_prompt TEXT DEFAULT 'You are a helpful assistant for Pakka Deshi, a traditional Indian cold-pressed mustard oil brand. Answer questions about our products, the cold-pressing process, and health benefits. Always be friendly and encourage users to contact us on WhatsApp for orders.',
    greeting_message TEXT DEFAULT 'Namaste! 🙏 I am the Pakka Deshi assistant. How can I help you today?',
    greeting_message_hi TEXT DEFAULT 'नमस्ते! 🙏 मैं पक्का देसी सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    tone ai_tone DEFAULT 'desi',
    max_tokens INTEGER DEFAULT 500,
    temperature DECIMAL(2,1) DEFAULT 0.7,
    fallback_message TEXT DEFAULT 'I don''t have information about that. Please contact us on WhatsApp for more details.',
    fallback_message_hi TEXT DEFAULT 'मेरे पास इसके बारे में जानकारी नहीं है। अधिक जानकारी के लिए कृपया हमसे WhatsApp पर संपर्क करें।',
    whatsapp_cta_enabled BOOLEAN DEFAULT true,
    whatsapp_cta_text TEXT DEFAULT 'Chat with us on WhatsApp',
    whatsapp_cta_text_hi TEXT DEFAULT 'WhatsApp पर हमसे बात करें',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_chatbot_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read AI settings" ON public.ai_chatbot_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage AI settings" ON public.ai_chatbot_settings
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 16. AI KNOWLEDGE BASE
-- =============================================
CREATE TABLE public.ai_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_hi TEXT,
    category TEXT DEFAULT 'general',
    keywords TEXT[],
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active knowledge" ON public.ai_knowledge_base
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage knowledge" ON public.ai_knowledge_base
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 17. CHAT LOGS (Analytics)
-- =============================================
CREATE TABLE public.chat_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT,
    language TEXT DEFAULT 'en',
    response_time_ms INTEGER,
    tokens_used INTEGER,
    whatsapp_clicked BOOLEAN DEFAULT false,
    user_ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view chat logs" ON public.chat_logs
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert chat logs" ON public.chat_logs
FOR INSERT WITH CHECK (true);

-- =============================================
-- 18. ENQUIRIES (Contact Form Submissions)
-- =============================================
CREATE TABLE public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    enquiry_type TEXT DEFAULT 'general',
    source TEXT DEFAULT 'website',
    is_read BOOLEAN DEFAULT false,
    is_replied BOOLEAN DEFAULT false,
    replied_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit enquiry" ON public.enquiries
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage enquiries" ON public.enquiries
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 19. DISTRIBUTORS
-- =============================================
CREATE TABLE public.distributors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    gst_number TEXT,
    expected_quantity TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply as distributor" ON public.distributors
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage distributors" ON public.distributors
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 20. TESTIMONIALS
-- =============================================
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_hi TEXT,
    location TEXT,
    location_hi TEXT,
    content TEXT NOT NULL,
    content_hi TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published testimonials" ON public.testimonials
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 21. FAQS (General Site FAQs)
-- =============================================
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    question_hi TEXT,
    answer TEXT NOT NULL,
    answer_hi TEXT,
    category TEXT DEFAULT 'general',
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published FAQs" ON public.faqs
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage FAQs" ON public.faqs
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- 22. NAVIGATION MENU
-- =============================================
CREATE TABLE public.navigation_menu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    label_hi TEXT,
    url TEXT NOT NULL,
    is_external BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES public.navigation_menu(id),
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.navigation_menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible menu" ON public.navigation_menu
FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage menu" ON public.navigation_menu
FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON public.media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_whatsapp_settings_updated_at BEFORE UPDATE ON public.whatsapp_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_chatbot_settings_updated_at BEFORE UPDATE ON public.ai_chatbot_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_knowledge_base_updated_at BEFORE UPDATE ON public.ai_knowledge_base FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_distributors_updated_at BEFORE UPDATE ON public.distributors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true);

-- Storage policies
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id IN ('media', 'certificates'));
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('media', 'certificates') AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update media" ON storage.objects FOR UPDATE USING (bucket_id IN ('media', 'certificates') AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE USING (bucket_id IN ('media', 'certificates') AND public.is_admin(auth.uid()));