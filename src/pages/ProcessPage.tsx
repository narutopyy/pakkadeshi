import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Wheat, Sun, Settings, Clock, Droplets, ThermometerSun, CheckCircle } from "lucide-react";
import heroImageAsset from "@/assets/pakka-deshi-hero-cold-pressed.png";
import bottleBackAsset from "@/assets/pakka-deshi-bottle-back.png";
import { useWhatsAppSettings, useVideos } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/hooks/useLanguage";

const ProcessPage = () => {
  const { language } = useLanguage();
  const { data: whatsappSettings } = useWhatsAppSettings();
  const { data: videos } = useVideos();

  const whatsappNumber = whatsappSettings?.phone_number?.replace(/\D/g, '') || '917275402632';
  const defaultMessage = language === 'hi' 
    ? (whatsappSettings?.default_message_hi || whatsappSettings?.default_message || '')
    : (whatsappSettings?.default_message || '');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  const processVideos = videos?.filter(v => v.category === 'process') || [];

  const processSteps = [
    {
      icon: Wheat,
      step: "01",
      title: language === 'hi' ? "बीज चयन" : "Seed Selection",
      description: language === 'hi' 
        ? "हम बलरामपुर और उत्तर प्रदेश के अन्य जिलों के स्थानीय किसानों से बेहतरीन देशी सरसों के बीजों का सावधानीपूर्वक चयन करते हैं। केवल इष्टतम तेल सामग्री वाले परिपक्व, स्वस्थ बीजों को ही चुना जाता है।"
        : "We carefully select the finest indigenous mustard seeds from local farmers in Balrampur and other districts of Uttar Pradesh. Only mature, healthy seeds with optimal oil content are chosen.",
      details: language === 'hi' 
        ? ["स्थानीय खेतों से हाथ से चुने गए", "शुद्धता के लिए गुणवत्ता निरीक्षण", "केवल परिपक्व बीजों का चयन", "नियंत्रित परिस्थितियों में संग्रहीत"]
        : ["Hand-picked from local farms", "Quality inspection for purity", "Only mature seeds selected", "Stored in controlled conditions"],
    },
    {
      icon: Sun,
      step: "02",
      title: language === 'hi' ? "धूप में सुखाना" : "Sun Drying",
      description: language === 'hi'
        ? "चुने हुए बीजों को नमी की मात्रा कम करने के लिए प्राकृतिक रूप से धूप में सुखाया जाता है। यह पारंपरिक कदम सुनिश्चित करता है कि तेल की शेल्फ लाइफ लंबी हो।"
        : "The selected seeds are naturally sun-dried to reduce moisture content. This traditional step ensures the oil has longer shelf life.",
      details: language === 'hi'
        ? ["प्राकृतिक धूप में सुखाने की प्रक्रिया", "इष्टतम नमी में कमी", "बीज की अखंडता को संरक्षित करता है", "पारंपरिक विधि का पालन"]
        : ["Natural sun drying process", "Optimal moisture reduction", "Preserves seed integrity", "Traditional method followed"],
    },
    {
      icon: Settings,
      step: "03",
      title: language === 'hi' ? "कोल्ड प्रेस्ड निष्कर्षण" : "Cold Pressed Extraction",
      description: language === 'hi'
        ? "बीजों को कम तापमान पर धीरे-धीरे प्रेस किया जाता है। कोई बाहरी गर्मी नहीं, कोई रसायन नहीं — पोषक तत्व, सुगंध और स्वाद बेहतर रूप से सुरक्षित रहते हैं।"
        : "Seeds are slowly pressed at low temperature. No external heat added, no chemical use — nutrients, aroma and flavour stay intact.",
      details: language === 'hi'
        ? ["कम तापमान कोल्ड प्रेस", "धीमी प्रेसिंग प्रक्रिया", "पोषक तत्वों की सुरक्षा", "कोई बाहरी गर्मी नहीं"]
        : ["Low-temperature cold press", "Slow pressing process", "Nutrient retention", "No external heat added"],
    },

    {
      icon: Clock,
      step: "04",
      title: language === 'hi' ? "प्राकृतिक निपटान" : "Natural Settling",
      description: language === 'hi'
        ? "निकाले गए तेल को कई दिनों तक प्राकृतिक रूप से बैठने दिया जाता है। तलछट नीचे बैठ जाती है, शुद्ध, स्पष्ट तेल ऊपर छोड़ देती है।"
        : "The extracted oil is left to settle naturally for several days. Sediments sink to the bottom, leaving pure, clear oil on top.",
      details: language === 'hi'
        ? ["प्राकृतिक अवसादन", "कोई रासायनिक फ़िल्टरिंग नहीं", "गति से अधिक धैर्य", "शुद्ध तेल निष्कर्षण"]
        : ["Natural sedimentation", "No chemical filtering", "Patience over speed", "Pure oil extraction"],
    },
    {
      icon: Droplets,
      step: "05",
      title: language === 'hi' ? "गुणवत्ता परीक्षण" : "Quality Testing",
      description: language === 'hi'
        ? "हर बैच पैकेजिंग के लिए अनुमोदित होने से पहले शुद्धता, सुगंध और स्थिरता के लिए कठोर गुणवत्ता परीक्षण से गुजरता है।"
        : "Every batch undergoes rigorous quality testing for purity, aroma, and consistency before being approved for packaging.",
      details: language === 'hi'
        ? ["शुद्धता परीक्षण", "सुगंध सत्यापन", "स्थिरता जांच", "प्रयोगशाला विश्लेषण"]
        : ["Purity testing", "Aroma verification", "Consistency checks", "Lab analysis"],
    },
    {
      icon: ThermometerSun,
      step: "06",
      title: language === 'hi' ? "ताज़ा पैकेजिंग" : "Fresh Packaging",
      description: language === 'hi'
        ? "तेल को उच्च-गुणवत्ता वाली, फूड-ग्रेड बोतलों में पैक किया जाता है ताकि किसी भी प्रकार का प्लास्टिक संदूषण न हो। ये बोतलें प्रकाश और हवा से बचाती हैं और ताजगी को लंबे समय तक संरक्षित रखती हैं।"
        : "Oil is packed in premium food-grade bottles that prevent any plastic contamination. These high-quality bottles protect against light and air, locking in freshness for longer.",
      details: language === 'hi'
        ? ["प्रीमियम फूड-ग्रेड बोतलें", "शून्य प्लास्टिक संदूषण", "प्रकाश-संरक्षित पैकेजिंग", "ताजगी के लिए सील"]
        : ["Premium food-grade bottles", "Zero plastic contamination", "Light-protected packaging", "Sealed for freshness"],
    },

  ];

  const benefits = [
    {
      title: language === 'hi' ? "पोषक तत्व संरक्षित" : "Nutrients Preserved",
      description: language === 'hi'
        ? "कम तापमान पर कोल्ड प्रेसिंग विटामिन ए, ई, और के, साथ ही आवश्यक फैटी एसिड को बनाए रखती है।"
        : "Cold pressing at low temperatures retains vitamins A, E, and K, plus essential fatty acids.",
    },
    {
      title: language === 'hi' ? "प्रामाणिक सुगंध" : "Authentic Aroma",
      description: language === 'hi'
        ? "असली सरसों तेल की विशिष्ट तीखी गंध केवल कोल्ड-प्रेस्ड किस्मों में पाई जाती है।"
        : "The distinctive pungent smell of real mustard oil is only found in cold-pressed varieties.",
    },
    {
      title: language === 'hi' ? "कोई रसायन नहीं" : "No Chemicals",
      description: language === 'hi'
        ? "रिफाइंड तेलों के विपरीत जो हेक्सेन और अन्य सॉल्वैंट्स का उपयोग करते हैं, हमारा तेल 100% प्राकृतिक है।"
        : "Unlike refined oils that use hexane and other solvents, our oil is 100% natural.",
    },
    {
      title: language === 'hi' ? "बेहतर स्वाद" : "Better Taste",
      description: language === 'hi'
        ? "समृद्ध, मजबूत स्वाद आपके खाना पकाने को उन तरीकों से बढ़ाता है जो रिफाइंड तेल बस नहीं कर सकता।"
        : "The rich, robust flavor enhances your cooking in ways refined oil simply cannot.",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImageAsset} alt="Anika Edible Oil cold pressed mustard oil bottle with mustard seeds and traditional press" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              {language === 'hi' ? 'हमारी प्रक्रिया' : 'Our Process'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
              {language === 'hi' ? 'हमारी ' : 'Our '}
              <span className="text-gradient-gold">{language === 'hi' ? 'कोल्ड प्रेस्ड प्रक्रिया' : 'Cold Pressed Process'}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {language === 'hi'
                ? 'जानें कि हम प्रीमियम सरसों के बीजों को कम तापमान पर प्रेस करके शुद्ध, सुगंधित और प्राकृतिक तेल में कैसे बदलते हैं।'
                : 'Discover how we transform premium mustard seeds into pure, aromatic oil through a low-temperature cold pressed process.'}
            </p>
          </div>
        </div>
      </section>

      {/* Video/Image Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {processVideos.length > 0 && processVideos[0].youtube_id ? (
              <div className="relative rounded-2xl overflow-hidden shadow-elevated aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${processVideos[0].youtube_id}`}
                  title={language === 'hi' ? (processVideos[0].title_hi || processVideos[0].title) : processVideos[0].title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src={bottleBackAsset}
                  alt="Back label view of Anika Edible Oil cold pressed mustard oil bottle"
                  className="w-full aspect-video object-contain bg-background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 to-transparent" />
                <div className="absolute bottom-6 left-6 text-secondary-foreground">
                  <p className="font-display text-2xl font-bold">
                    {language === 'hi' ? 'स्वच्छ लेबल और शुद्ध उत्पाद' : 'Clean Label, Pure Product'}
                  </p>
                  <p className="text-sm opacity-80">
                    {language === 'hi' ? '100% केमिकल फ्री, अनप्रोसेस्ड और अनरिफाइंड' : '100% chemical free, unprocessed and unrefined'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'hi' ? 'बीज से तेल तक' : 'From Seed to Oil'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'hi' 
                ? 'हमारी प्रक्रिया का हर कदम शुद्धता को संरक्षित करने और गुणवत्ता बढ़ाने के लिए डिज़ाइन किया गया है'
                : 'Every step in our process is designed to preserve purity and enhance quality'}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {processSteps.map((step, idx) => (
                <div
                  key={step.step}
                  className={`flex flex-col md:flex-row gap-6 md:gap-8 items-start ${
                    idx % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex md:flex-col items-center gap-4 md:gap-2">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-gold">
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <span className="font-display text-4xl font-bold text-primary/30">{step.step}</span>
                  </div>

                  <div className="flex-1 bg-card p-6 md:p-8 rounded-2xl border border-border">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {step.details.map((detail) => (
                        <div key={detail} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {language === 'hi' ? 'कोल्ड-प्रेस्ड क्यों मायने रखता है' : 'Why Cold-Pressed Matters'}
            </h2>
            <p className="text-secondary-foreground/80">
              {language === 'hi' 
                ? 'कोल्ड-प्रेस्ड और रिफाइंड तेल के बीच अंतर सिर्फ स्वाद में नहीं है'
                : 'The difference between cold-pressed and refined oil is not just in taste'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-background text-foreground p-6 rounded-2xl text-center">
                <h3 className="font-display font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'hi' ? 'अंतर का अनुभव करें' : 'Experience the Difference'}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            {language === 'hi'
              ? 'प्रामाणिक कोल्ड प्रेस्ड सरसों तेल का स्वाद लेने के लिए तैयार? अभी ऑर्डर करें और शुद्धता को अपनी रसोई तक लाएं।'
              : 'Ready to taste authentic cold pressed mustard oil? Order now and bring real purity to your kitchen.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button variant="hero" size="xl">
                {language === 'hi' ? 'हमारे उत्पाद देखें' : 'View Our Products'}
              </Button>
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="xl">
                <MessageCircle className="w-5 h-5" />
                {language === 'hi' ? 'WhatsApp पर सवाल पूछें' : 'Ask Questions on WhatsApp'}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProcessPage;
