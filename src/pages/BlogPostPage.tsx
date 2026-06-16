import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { useWhatsAppSettings } from "@/hooks/useSiteSettings";

type Post = {
  id: string;
  slug: string;
  title: string;
  title_hi: string | null;
  content: string | null;
  content_hi: string | null;
  excerpt: string | null;
  excerpt_hi: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

// Minimal markdown → HTML renderer (headings, bold, links, lists, paragraphs)
const renderMarkdown = (md: string) => {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;
  const flushList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (/^#{1,6}\s/.test(line)) {
      flushList();
      const level = line.match(/^#+/)![0].length;
      const text = inline(escape(line.replace(/^#+\s/, "")));
      const cls =
        level === 1
          ? "font-display text-3xl md:text-4xl font-bold mt-8 mb-4 text-foreground"
          : level === 2
          ? "font-display text-2xl md:text-3xl font-bold mt-8 mb-3 text-foreground"
          : "font-display text-xl md:text-2xl font-semibold mt-6 mb-2 text-foreground";
      html += `<h${level} class="${cls}">${text}</h${level}>`;
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      if (!inList) {
        html += '<ul class="list-disc pl-6 space-y-2 my-4 text-muted-foreground">';
        inList = true;
      }
      html += `<li>${inline(escape(line.replace(/^[-*]\s/, "")))}</li>`;
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      // simple ordered list (one-off)
      flushList();
      html += `<p class="text-muted-foreground leading-relaxed my-3">${inline(escape(line))}</p>`;
      continue;
    }
    flushList();
    html += `<p class="text-base md:text-lg text-muted-foreground leading-relaxed my-4">${inline(escape(line))}</p>`;
  }
  flushList();
  return html;

  function inline(s: string) {
    return s
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>'
      );
  }
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { data: whatsappSettings } = useWhatsAppSettings();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);

  const whatsappNumber =
    whatsappSettings?.phone_number?.replace(/\D/g, "") || "917275402632";

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    supabase
      .from("blog_posts")
      .select(
        "id, slug, title, title_hi, content, content_hi, excerpt, excerpt_hi, featured_image_url, published_at, meta_title, meta_description"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (!data) setNotFound(true);
        else setPost(data as Post);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen pt-32 text-center container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold mb-4">Post not found</h1>
        <Link to="/blog" className="text-primary underline">Back to blog</Link>
      </div>
    );
  }

  if (!post) {
    return <div className="min-h-screen pt-32 text-center text-muted-foreground">Loading…</div>;
  }

  const title = language === "hi" && post.title_hi ? post.title_hi : post.title;
  const content =
    language === "hi" && post.content_hi ? post.content_hi : post.content || "";
  const excerpt =
    language === "hi" && post.excerpt_hi ? post.excerpt_hi : post.excerpt || "";
  const shareMsg = encodeURIComponent(`${title} — https://pakka-deshi-digital-roots.lovable.app/blog/${post.slug}`);

  return (
    <div className="min-h-screen pt-20">
      <Helmet>
        <title>{post.meta_title || `${title} | Pakka Deshi`}</title>
        <meta name="description" content={post.meta_description || excerpt} />
        <link rel="canonical" href={`https://pakka-deshi-digital-roots.lovable.app/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={post.meta_description || excerpt} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            datePublished: post.published_at,
            image: post.featured_image_url || undefined,
            author: { "@type": "Organization", name: "Pakka Deshi" },
          })}
        </script>
      </Helmet>

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "hi" ? "ब्लॉग पर वापस" : "Back to blog"}
        </Link>

        {post.published_at && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.published_at).toLocaleDateString(
              language === "hi" ? "hi-IN" : "en-IN",
              { year: "numeric", month: "long", day: "numeric" }
            )}
          </div>
        )}

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
          {title}
        </h1>

        {post.featured_image_url && (
          <img
            src={post.featured_image_url}
            alt={title}
            className="w-full rounded-2xl shadow-elevated mb-8 aspect-[16/10] object-cover"
          />
        )}

        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />

        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            {language === "hi" ? "हमारा शुद्ध तेल आज़माएं" : "Try our pure cold pressed oil"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {language === "hi"
              ? "बलरामपुर से सीधे आपकी रसोई तक — पूरे भारत में डिलीवरी।"
              : "Pressed in Balrampur, delivered across India."}
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${shareMsg}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp" size="lg">
              <MessageCircle className="w-4 h-4" />
              {language === "hi" ? "WhatsApp पर ऑर्डर करें" : "Order on WhatsApp"}
            </Button>
          </a>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
