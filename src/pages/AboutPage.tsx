import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Users, Leaf, Award, MapPin, Calendar } from "lucide-react";
import storyImageAsset from "@/assets/pakka-deshi-bottle-natural.png.asset.json";
import { useWhatsAppSettings, useCertifications } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/hooks/useLanguage";

const AboutPage = () => {
  const { language } = useLanguage();
  const { data: whatsappSettings } = useWhatsAppSettings();
  const { data: certifications } = useCertifications();

  const whatsappNumber = whatsappSettings?.phone_number?.replace(/\D/g, '') || '917275402632';
  const defaultMessage = language === 'hi' 
    ? (whatsappSettings?.default_message_hi || whatsappSettings?.default_message || '')
    : (whatsappSettings?.default_message || '');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  const values = [
    {
      icon: Heart,
      title: language === 'hi' ? "प्रामाणिकता" : "Authenticity",
      description: language === 'hi' 
        ? "हम परंपरा से कभी समझौता नहीं करते। हमारे तेल की हर बूंद पीढ़ियों की विरासत को वहन करती है।"
        : "We never compromise on tradition. Every drop of our oil carries the legacy of generations.",
    },
    {
      icon: Users,
      title: language === 'hi' ? "समुदाय" : "Community",
      description: language === 'hi'
        ? "हम स्थानीय किसानों के साथ सीधे काम करते हैं, उचित मूल्य और टिकाऊ प्रथाओं को सुनिश्चित करते हैं।"
        : "We work directly with local farmers, ensuring fair prices and sustainable practices.",
    },
    {
      icon: Leaf,
      title: language === 'hi' ? "शुद्धता" : "Purity",
      description: language === 'hi'
        ? "कोई रसायन नहीं, कोई मिलावट नहीं। बस शुद्ध, मिलावट रहित सरसों का तेल जैसा प्रकृति ने बनाया।"
        : "No chemicals, no additives. Just pure, unadulterated mustard oil as nature intended.",
    },
    {
      icon: Award,
      title: language === 'hi' ? "गुणवत्ता" : "Quality",
      description: language === 'hi'
        ? "हर कदम पर कठोर गुणवत्ता जांच यह सुनिश्चित करती है कि केवल सर्वश्रेष्ठ ही आपकी रसोई तक पहुंचे।"
        : "Rigorous quality checks at every step ensure only the best reaches your kitchen.",
    },
  ];

  const milestones = [
    { year: "1975", event: language === 'hi' ? "परिवार ने बलरामपुर में पारंपरिक तेल निष्कर्षण शुरू किया" : "Family started traditional oil extraction in Balrampur" },
    { year: "2010", event: language === 'hi' ? "तीसरी पीढ़ी ने पारिवारिक व्यवसाय संभाला" : "Third generation takes over the family business" },
    { year: "2018", event: language === 'hi' ? "पक्का देसी ब्रांड आधिकारिक रूप से लॉन्च" : "Pakka Deshi brand officially launched" },
    { year: "2020", event: language === 'hi' ? "उत्तर प्रदेश भर में वितरण का विस्तार" : "Expanded distribution across Uttar Pradesh" },
    { year: "2023", event: language === 'hi' ? "WhatsApp ऑर्डर के माध्यम से पूरे भारत में डिलीवरी शुरू" : "Started pan-India delivery via WhatsApp orders" },
    { year: "2024", event: language === 'hi' ? "10,000+ खुश ग्राहकों का मील का पत्थर" : "10,000+ happy customers milestone" },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-hero-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              {language === 'hi' ? 'हमारी कहानी' : 'Our Story'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
              {language === 'hi' ? 'शुद्ध परंपरा की ' : 'A Legacy of '}
              <span className="text-gradient-gold">{language === 'hi' ? 'विरासत' : 'Pure Tradition'}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {language === 'hi'
                ? 'बलरामपुर के एक छोटे से गाँव से पूरे भारत की रसोई तक, पक्का देसी सदियों पुरानी विधियों का उपयोग करके बेहतरीन कोल्ड-प्रेस्ड सरसों तेल का उत्पादन करने की पारिवारिक परंपरा को आगे बढ़ाता है।'
                : 'From a small village in Balrampur to kitchens across India, Pakka Deshi carries forward a family tradition of producing the finest cold-pressed mustard oil using age-old methods.'}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={storyImageAsset.url}
                alt="Pakka Deshi cold pressed mustard oil bottle in a natural farm setting"
                className="w-full rounded-2xl shadow-elevated"
              />
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                {language === 'hi' ? 'खेत से मेज तक ' : 'Our Journey from '}
                <span className="text-gradient-gold">{language === 'hi' ? 'हमारी यात्रा' : 'Farm to Table'}</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {language === 'hi'
                    ? 'पक्का देसी एक सरल विश्वास से पैदा हुआ था - कि पारंपरिक सरसों तेल का शुद्ध, प्रामाणिक स्वाद सभी के लिए सुलभ होना चाहिए। हमारी कहानी बलरामपुर, उत्तर प्रदेश के सरसों के खेतों से शुरू होती है, जहां हमारा परिवार तीन पीढ़ियों से सरसों की खेती कर रहा है।'
                    : "Pakka Deshi was born from a simple belief – that the pure, authentic taste of traditional mustard oil should be accessible to everyone. Our story begins in the mustard fields of Balrampur, Uttar Pradesh, where our family has been cultivating mustard for over three generations."}
                </p>
                <p>
                  {language === 'hi'
                    ? "ऐसे समय में जब रिफाइंड और रासायनिक रूप से प्रोसेस्ड तेल बाजार में भरे पड़े हैं, हमने शुद्ध कोल्ड प्रेस्ड विधि को चुना। कम तापमान पर निकाला गया हमारा तेल अपनी प्राकृतिक सुगंध, पोषक तत्वों और असली सुनहरे रंग को बेहतर तरीके से बनाए रखता है।"
                    : "In an era where refined, chemically processed oils dominate the market, we chose a pure cold pressed method. By extracting oil at low temperature, we preserve the natural aroma, nutrients, and rich golden colour that make real mustard oil stand out."}
                </p>
                <p>
                  {language === 'hi'
                    ? 'आज, पक्का देसी पूरे भारत में हजारों परिवारों की सेवा करता है जो प्रामाणिकता और स्वास्थ्य को महत्व देते हैं। हमारी बेची गई हर बोतल में हमारी विरासत का सार और गुणवत्ता के प्रति हमारी प्रतिबद्धता है।'
                    : 'Today, Pakka Deshi serves thousands of families across India who value authenticity and health. Every bottle we sell carries the essence of our heritage and our commitment to quality.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'hi' ? 'हमारे मूल मूल्य' : 'Our Core Values'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'hi' 
                ? 'जो हमें हर दिन आपके लिए सबसे अच्छा सरसों तेल लाने में मार्गदर्शन करता है'
                : 'What guides us every day in bringing you the best mustard oil'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card p-6 rounded-2xl border border-border text-center card-hover"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {language === 'hi' ? 'हमारी उपलब्धियां' : 'Our Milestones'}
            </h2>
            <p className="text-secondary-foreground/80">
              {language === 'hi' ? 'जुनून, परंपरा और विकास की एक यात्रा' : 'A journey of passion, tradition, and growth'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 transform md:-translate-x-0.5" />

              {milestones.map((milestone, idx) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center gap-6 mb-8 ${
                    idx % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary transform -translate-x-1.5 md:-translate-x-1.5" />

                  <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${idx % 2 === 0 ? "md:text-right" : ""}`}>
                    <div className="bg-background text-foreground p-4 rounded-xl inline-block">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-display font-bold text-primary">{milestone.year}</span>
                      </div>
                      <p className="text-sm">{milestone.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {language === 'hi' ? 'हमारे प्रमाणन' : 'Our Certifications'}
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-center">
                  {cert.logo_url && (
                    <img src={cert.logo_url} alt={cert.name} className="h-16 mx-auto mb-2" />
                  )}
                  <p className="font-semibold text-foreground">
                    {language === 'hi' ? (cert.name_hi || cert.name) : cert.name}
                  </p>
                  {cert.issuing_authority && (
                    <p className="text-sm text-muted-foreground">{cert.issuing_authority}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      <section className="py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-background rounded-2xl p-8 md:p-12 border border-border">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    {language === 'hi' ? 'बलरामपुर में गर्व से निर्मित' : 'Proudly Made in Balrampur'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === 'hi'
                      ? 'हमारी सुविधा उत्तर प्रदेश के सरसों बेल्ट के दिल में स्थित है। हम 50 किमी के दायरे में स्थानीय किसानों से सीधे बीज प्राप्त करते हैं, ताजगी सुनिश्चित करते हुए और स्थानीय खेती समुदाय का समर्थन करते हैं।'
                      : 'Our facility is located in the heart of Uttar Pradesh\'s mustard belt. We source seeds directly from local farmers within a 50km radius, ensuring freshness and supporting the local farming community.'}
                  </p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="whatsapp">
                      <MessageCircle className="w-4 h-4" />
                      {language === 'hi' ? 'WhatsApp पर संपर्क करें' : 'Contact Us on WhatsApp'}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
