import { Link } from "react-router-dom";
import { Play, ArrowRight, Heart } from "lucide-react";
import heroShowcaseAsset from "@/assets/pakka-deshi-hero-cold-pressed.png";
import bottleFrontAsset from "@/assets/pakka-deshi-bottle-front.png";
import { useProducts, useWhatsAppSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/hooks/useLanguage";

const HomePage = () => {
  const { language } = useLanguage();
  const { data: products } = useProducts();
  const { data: whatsappSettings } = useWhatsAppSettings();

  const whatsappNumber = whatsappSettings?.phone_number?.replace(/\D/g, "") || "917275402632";
  const defaultMessage = language === "hi"
    ? whatsappSettings?.default_message_hi || whatsappSettings?.default_message || ""
    : whatsappSettings?.default_message || "";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  const featuredProducts = products?.filter((p) => p.is_featured)?.slice(0, 2) || [];

  const features = [
    {
      eyebrow: "01 / Origin",
      title: language === "hi" ? "विरासत बीज" : "Heritage Seeds",
      desc:
        language === "hi"
          ? "बलरामपुर के स्थानीय किसानों से सीधे प्राप्त, उच्च गुणवत्ता वाले देशी सरसों के बीज।"
          : "Sourced directly from local farmers in Balrampur, using high-quality indigenous mustard seeds.",
      hoverBg: "hover:bg-primary",
      labelColor: "text-primary",
    },
    {
      eyebrow: "02 / Craft",
      title: language === "hi" ? "कोल्ड प्रेस्ड" : "Cold Pressed",
      desc:
        language === "hi"
          ? "कम तापमान पर कोल्ड प्रेस्ड — कोई अतिरिक्त गर्मी नहीं, कोई रिफाइनिंग नहीं, और पोषक तत्वों का बेहतर संरक्षण।"
          : "Cold pressed at low temperature — no added heat, no refining, and better retention of nutrients, aroma and taste.",
      hoverBg: "hover:bg-accent",
      labelColor: "text-accent",
    },
    {
      eyebrow: "03 / Purity",
      title: language === "hi" ? "100% रसायन-मुक्त" : "100% Chemical Free",
      desc:
        language === "hi"
          ? "कोई परिरक्षक नहीं, कोई रसायन नहीं, कोई कृत्रिम रंग या स्वाद नहीं। पूरी तरह अपरिष्कृत, अनप्रोसेस्ड सरसों तेल।"
          : "No preservatives, no chemicals, no artificial colours or flavours. Fully unrefined, unprocessed mustard oil.",
      hoverBg: "hover:bg-secondary",
      labelColor: "text-secondary",
    },
  ];

  return (
    <div className="bg-background text-foreground font-body">
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 animate-fade-up">
            <div className="inline-flex items-center gap-2 mb-8 border border-accent px-3 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
                {language === "hi" ? "100% कोल्ड प्रेस्ड और रसायन-मुक्त" : "100% Cold Pressed & Chemical Free"}
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8 text-foreground">
              {language === "hi" ? (
                <>
                  बलरामपुर का <br />
                  <span className="text-primary">सुनहरा</span> सार।
                </>
              ) : (
                <>
                  THE GOLDEN <br />
                  <span className="text-primary">SOUL OF</span> BALRAMPUR.
                </>
              )}
            </h1>

            <p className="text-base md:text-lg max-w-lg mb-12 leading-relaxed text-foreground/75">
              {language === "hi"
                ? "उत्तर प्रदेश के हृदय से शुद्ध, तीखी खुशबू वाला कोल्ड प्रेस्ड सरसों तेल — सीमित उत्पादन, उच्च गुणवत्ता और बिना किसी मिलावट के।"
                : "Experience pure cold pressed mustard oil with rich aroma, natural pungency and quality-first production from the heart of Uttar Pradesh."}
            </p>

            <div className="flex flex-wrap gap-8 items-center">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-[hsl(var(--terracotta-dark))] transition-colors">
                {language === "hi" ? "व्हाट्सएप पर ऑर्डर करें" : "Order on WhatsApp"}
              </a>
              <Link to="/process" className="flex items-center gap-3 group">
                <span className="w-12 h-12 rounded-full border border-foreground flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                  <Play className="w-4 h-4 fill-current" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest">
                  {language === "hi" ? "हमारी प्रक्रिया देखें" : "Watch Our Process"}
                </span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-12 gap-y-6 mt-12 pt-8 border-t border-foreground/10 max-w-md">
              <div>
                <p className="font-display text-2xl font-bold">Cold Pressed</p>
                <p className="eyebrow text-foreground/60 mt-1">{language === "hi" ? "कम तापमान प्रक्रिया" : "Low Temperature Method"}</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold">Balrampur</p>
                <p className="eyebrow text-foreground/60 mt-1">{language === "hi" ? "उत्तर प्रदेश" : "Uttar Pradesh"}</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold">100%</p>
                <p className="eyebrow text-foreground/60 mt-1">{language === "hi" ? "शुद्ध और प्राकृतिक" : "Pure & Natural"}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] lg:aspect-[5/4] overflow-hidden relative bg-secondary/5 flex items-center justify-center">
              <img
                src={heroShowcaseAsset}
                alt="Pakka Deshi cold pressed mustard oil bottle with mustard seeds and traditional press"
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/35 via-secondary/5 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 md:right-auto bg-accent p-6 text-accent-foreground md:max-w-[300px] shadow-lg">
                <p className="font-display text-lg leading-tight mb-2 font-semibold">
                  {language === "hi"
                    ? "कम तापमान पर कोल्ड प्रेस्ड, ताकि स्वाद और पोषण बना रहे।"
                    : "Cold pressed at low temperature to retain nutrition and real mustard flavour."}
                </p>
                <p className="text-xs opacity-80 leading-relaxed">
                  {language === "hi"
                    ? "कोई रसायन नहीं, कोई कृत्रिम स्वाद नहीं, कोई अनावश्यक प्रोसेसिंग नहीं।"
                    : "No chemicals, no artificial flavour, and no unnecessary processing."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-3 border-t border-b border-foreground/20">
          {features.map((f, i) => (
            <div
              key={i}
              className={`p-12 ${i < 2 ? "md:border-r border-foreground/20" : ""} group transition-all duration-500 ${f.hoverBg}`}
            >
              <p className={`eyebrow ${f.labelColor} group-hover:text-primary-foreground mb-6`}>
                {f.eyebrow}
              </p>
              <h3 className="font-display text-3xl font-bold mb-4 text-foreground group-hover:text-primary-foreground">
                {f.title}
              </h3>
              <p className="text-sm opacity-70 leading-relaxed group-hover:text-primary-foreground/80">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <p className="eyebrow text-primary mb-4">{language === "hi" ? "हमारा संग्रह" : "Our Collection"}</p>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase mb-10 leading-none text-foreground">
              {language === "hi" ? "शुद्ध कोल्ड प्रेस्ड" : "Pure Cold Pressed"} <br />
              <span className="text-primary">
                {language === "hi" ? "सरसों तेल" : "Mustard Oil"}
              </span>
            </h2>

            <div className="space-y-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((p: any) => (
                  <div key={p.id} className="flex justify-between items-end border-b border-foreground/10 pb-4">
                    <div>
                      <p className="font-bold text-foreground">
                        {language === "hi" && p.name_hi ? p.name_hi : p.name}
                      </p>
                      {p.short_description && (
                        <p className="text-sm opacity-60 italic">{p.short_description}</p>
                      )}
                    </div>
                    {p.base_price ? (
                      <p className="font-display text-xl font-bold text-foreground">₹{p.base_price}</p>
                    ) : (
                      <p className="eyebrow text-primary">{language === "hi" ? "व्हाट्सएप पर पूछें" : "Ask on WhatsApp"}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="border-b border-foreground/10 pb-4 text-sm text-foreground/70">
                  {language === "hi"
                    ? "मूल्य सूची के लिए कृपया व्हाट्सएप पर संपर्क करें।"
                    : "Please contact us on WhatsApp for the current price list and available pack sizes."}
                </div>
              )}

              <Link
                to="/products"
                className="w-full py-4 border-2 border-foreground text-xs font-black uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2"
              >
                {language === "hi" ? "पूरा संग्रह देखें" : "Explore Full Collection"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 h-[500px] bg-primary relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white,_transparent_70%)]" />
            <img
              src={bottleFrontAsset.url}
              alt="Front view of Pakka Deshi cold pressed mustard oil bottle"
              className="relative z-10 max-h-[86%] object-contain drop-shadow-2xl"
              loading="lazy"
            />
            <Heart className="absolute top-10 right-10 w-20 h-20 text-primary-foreground/15" fill="currentColor" />
          </div>
        </div>
      </section>

      <section className="bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-primary mb-6">{language === "hi" ? "विरासत" : "Heritage"}</p>
            <h2 className="font-display text-3xl md:text-5xl font-black leading-tight">
              {language === "hi"
                ? "“असली स्वाद वहीं है जहाँ परंपरा और शुद्धता साथ हों।”"
                : "“Real taste lives where tradition and purity stay intact.”"}
            </h2>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-[hsl(var(--terracotta-dark))] transition-colors inline-flex items-center gap-2"
            >
              {language === "hi" ? "अभी ऑर्डर करें" : "Order Now"}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

