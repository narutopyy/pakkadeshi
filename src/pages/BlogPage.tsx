import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogPosts } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/hooks/useLanguage";

const BlogPage = () => {
  const { language } = useLanguage();
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen pt-20">
      <Helmet>
        <title>Blog — Anika Edible Oil | Pure Cold-Pressed Mustard Oil</title>
        <meta name="description" content="Stories, recipes and traditional wisdom from Anika Edible Oil — pure cold pressed mustard oil from Balrampur, U.P." />
        <link rel="canonical" href="https://www.pureganix.in/blog" />
      </Helmet>

      <section className="py-12 md:py-20 bg-hero-pattern">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">
            {language === "hi" ? "हमारा ब्लॉग" : "Our Blog"}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            {language === "hi" ? "स्वास्थ्य, परंपरा और " : "Stories on Health, Tradition & "}
            <span className="text-gradient-gold">{language === "hi" ? "स्वाद की कहानियाँ" : "Taste"}</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {language === "hi"
              ? "शुद्ध तेल, घरेलू नुस्खे और बलरामपुर की पारंपरिक कोल्ड प्रेस प्रक्रिया की कहानियाँ।"
              : "Pure oil, kitchen wisdom and the traditional cold pressed story — straight from Balrampur."}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {isLoading && (
            <div className="text-center text-muted-foreground py-12">Loading…</div>
          )}

          {!isLoading && (!posts || posts.length === 0) && (
            <div className="text-center text-muted-foreground py-12">
              {language === "hi" ? "अभी कोई पोस्ट नहीं।" : "No posts yet. Check back soon."}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => {
              const title = language === "hi" && post.title_hi ? post.title_hi : post.title;
              const excerpt =
                language === "hi" && post.excerpt_hi ? post.excerpt_hi : post.excerpt;
              return (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-card border border-border rounded-2xl overflow-hidden card-hover flex flex-col"
                >
                  {post.featured_image_url && (
                    <div className="aspect-[16/10] bg-muted overflow-hidden">
                      <img
                        src={post.featured_image_url}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    {post.published_at && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.published_at).toLocaleDateString(
                          language === "hi" ? "hi-IN" : "en-IN",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </div>
                    )}
                    <h2 className="font-display font-bold text-lg text-foreground mb-2 line-clamp-2">
                      {title}
                    </h2>
                    {excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {excerpt}
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                      {language === "hi" ? "पढ़ें" : "Read more"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
