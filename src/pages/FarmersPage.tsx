import { ArrowRight, Sprout, Users, ShieldCheck, Leaf, TrendingUp, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useWhatsAppSettings } from "@/hooks/useSiteSettings";

const FarmersPage = () => {
  const { language } = useLanguage();
  const { data: whatsappSettings } = useWhatsAppSettings();

  const isHi = language === "hi";

  const whatsappNumber = whatsappSettings?.phone_number?.replace(/\D/g, "") || "917275402632";
  const defaultMessage = isHi
    ? whatsappSettings?.default_message_hi || whatsappSettings?.default_message || ""
    : whatsappSettings?.default_message || "";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="bg-background text-foreground font-body">
      {/* HERO */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7 animate-fade-up">
            <p className="eyebrow text-accent mb-6">
              {isHi ? "समुदायों को सशक्त बनाना" : "EMPOWERING COMMUNITIES"}
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-8 text-foreground">
              {isHi ? (
                <>
                  हर बूंद के पीछे <br />
                  <span className="text-primary">किसान</span>।
                </>
              ) : (
                <>
                  The Farmers <br />
                  <span className="text-primary">Behind</span> Every Drop.
                </>
              )}
            </h1>
            <p className="text-base md:text-lg max-w-xl leading-relaxed text-foreground/75">
              {isHi
                ? "हम खुले बाजार से बीज नहीं खरीदते। हम खेतों में जाते हैं, असली किसानों से हाथ मिलाते हैं, और ऐसे संबंध बनाते हैं जो सुनिश्चित करते हैं कि केवल बेहतरीन सरसों ही हमारे कोल्हू तक पहुंचे।"
                : "We do not buy seeds from the open market. We go to the fields, shake hands with real farmers, and build relationships that ensure only the finest mustard reaches our kolhus."}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-secondary p-8 md:p-10 text-secondary-foreground">
              <p className="font-display text-2xl font-bold leading-tight mb-4">
                {isHi ? "300 किसान। एक दृष्टिकोण।" : "300 Farmers. One Vision."}
              </p>
              <p className="text-sm opacity-80 leading-relaxed mb-6">
                {isHi
                  ? "हम बलरामपुर में समर्पित किसानों का एक नेटवर्क बना रहे हैं। बड़े या छोटे, हर किसान शुद्धता के हमारे मिशन में एक साथी है।"
                  : "We are building a network of dedicated farmers across Balrampur. Large or small, every farmer is a partner in our mission for purity."}
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest hover:bg-[hsl(var(--terracotta-dark))] transition-colors"
              >
                {isHi ? "हमारे साथ जुड़ें" : "Partner With Us"}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* THE PROBLEM */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="border-t border-foreground/20 pt-16">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-primary mb-4">
                {isHi ? "समस्या" : "THE PROBLEM"}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-black leading-tight">
                {isHi ? (
                  <>
                    खुले बाजार <br />
                    <span className="text-primary">की अंधेरी</span>
                  </>
                ) : (
                  <>
                    Open Market <br />
                    <span className="text-primary">Blindness</span>
                  </>
                )}
              </h2>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-10">
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">
                  {isHi ? "मात्रा गुणवत्ता पर भारी" : "Quantity Over Quality"}
                </h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  {isHi
                    ? "जो किसान खुले बाजार में उपज लाते हैं, उनका एक ही लक्ष्य होता है: अधिकतम पैदावार। इसका मतलब अक्सर अत्यधिक रासायनिक उर्वरकों का उपयोग और बीज की प्राकृतिक पोषक तत्व घनत्व का बलिदान होता है।"
                    : "Farmers who bring produce to the open market are driven by one goal: maximum yield. This often means using excessive chemical fertilizers and sacrificing the natural nutrient density of the seed."}
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">
                  {isHi ? "अज्ञात उत्पत्ति" : "Untraceable Origins"}
                </h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  {isHi
                    ? "ज्यादातर कंपनियां व्यापारियों से बीज खरीदती हैं बिना यह जाने कि उन्हें किसने उगाया, उनके साथ कैसा व्यवहार किया गया, या क्या वे कोल्ड-प्रेस निष्कर्षण के लिए उपयुक्त भी हैं।"
                    : "Most companies buy seeds from traders with no knowledge of who grew them, how they were treated, or whether they are even suitable for cold-press extraction."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR APPROACH — FULL WIDTH STRIP */}
      <section className="bg-secondary text-secondary-foreground mb-32">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <p className="eyebrow text-primary mb-6">
                {isHi ? "हमारा दृष्टिकोण" : "OUR APPROACH"}
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-black leading-tight mb-8">
                {isHi ? (
                  <>
                    सीधे <br />
                    <span className="text-primary">मिट्टी</span> से।
                  </>
                ) : (
                  <>
                    Direct From <br />
                    The <span className="text-primary">Soil</span>.
                  </>
                )}
              </h2>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold mb-1">
                      {isHi ? "किसान साझेदारी" : "Farmer Partnership"}
                    </h4>
                    <p className="text-sm opacity-70 leading-relaxed">
                      {isHi
                        ? "हम बलरामपुर के किसानों से सीधे जुड़ते हैं। हम उन्हें विशिष्ट सरसों बीज की किस्में प्रदान करते हैं जिनकी हमें आवश्यकता है, यह सुनिश्चित करते हुए कि कच्चा माल पहले दिन से हमारी कोल्ड-प्रेस प्रक्रिया के अनुरूप हो।"
                        : "We connect directly with farmers in Balrampur. We provide them with the specific mustard seed varieties we need, ensuring the raw material is tailored for our cold-press process from day one."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Sprout className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold mb-1">
                      {isHi ? "निर्देशित खेती" : "Guided Cultivation"}
                    </h4>
                    <p className="text-sm opacity-70 leading-relaxed">
                      {isHi
                        ? "किसान हमारी सलाह पर सरसों के बीज बोते हैं। हम उन्हें सर्वोत्तम प्रथाओं पर मार्गदर्शन देते हैं ताकि फसल हमारे कठोर गुणवत्ता मापदंडों को पूरा करे।"
                        : "Farmers plant the mustard seeds we recommend. We guide them on best practices so the harvest meets our strict quality benchmarks before we ever purchase a single kilogram."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold mb-1">
                      {isHi ? "सीधी खरीद" : "Direct Purchase"}
                    </h4>
                    <p className="text-sm opacity-70 leading-relaxed">
                      {isHi
                        ? "कोई बिचौलिया नहीं। कोई व्यापारी नहीं। हम किसान से सीधे उचित मूल्य पर फसल खरीदते हैं, एक पारदर्शी और सम्मानजनक आपूर्ति श्रृंखला बनाते हैं।"
                        : "No middlemen. No traders. We buy the harvested produce straight from the farmer at fair prices, creating a transparent and dignified supply chain."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-background/5 border border-background/10 p-8">
                  <p className="font-display text-4xl font-black text-primary mb-2">300</p>
                  <p className="text-sm opacity-80 font-bold uppercase tracking-widest">
                    {isHi ? "लक्ष्य किसान" : "Farmers Target"}
                  </p>
                </div>
                <div className="bg-background/5 border border-background/10 p-8">
                  <p className="font-display text-4xl font-black text-primary mb-2">0</p>
                  <p className="text-sm opacity-80 font-bold uppercase tracking-widest">
                    {isHi ? "बिचौलिए" : "Middlemen"}
                  </p>
                </div>
                <div className="bg-background/5 border border-background/10 p-8">
                  <p className="font-display text-4xl font-black text-primary mb-2">100%</p>
                  <p className="text-sm opacity-80 font-bold uppercase tracking-widest">
                    {isHi ? "गुणवत्ता जांच" : "Quality Checked"}
                  </p>
                </div>
                <div className="bg-background/5 border border-background/10 p-8">
                  <p className="font-display text-4xl font-black text-primary mb-2">5</p>
                  <p className="text-sm opacity-80 font-bold uppercase tracking-widest">
                    {isHi ? "जिले" : "Districts"}
                  </p>
                  <p className="text-xs opacity-60 mt-1">Balrampur & nearby, UP</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORGANIC PUSH */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] bg-accent/10 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="w-32 h-32 text-accent/30" strokeWidth={1} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-1/3" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow text-accent mb-4">
              {isHi ? "जैविक प्रतिबद्धता" : "ORGANIC COMMITMENT"}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-black leading-tight mb-6">
              {isHi ? (
                <>
                  किसानों को <br />
                  <span className="text-accent">जैविक</span> की ओर ले जाना।
                </>
              ) : (
                <>
                  Moving Farmers <br />
                  Toward <span className="text-accent">Organic</span>.
                </>
              )}
            </h2>
            <p className="text-base leading-relaxed text-foreground/75 mb-6">
              {isHi
                ? "हम अपने साथी किसानों को जैविक खेती के फायदों के बारे में सक्रिय रूप से शिक्षित करते हैं। हम समझाते हैं कि कैसे प्राकृतिक तरीके मिट्टी के स्वास्थ्य में सुधार करते हैं, समय के साथ इनपुट लागत कम करते हैं, और उच्च पोषक मूल्य वाले बीज उत्पादन करते हैं।"
                : "We actively educate our partner farmers on the benefits of organic farming. We explain how natural methods improve soil health, reduce input costs over time, and produce seeds with higher nutrient value."}
            </p>
            <p className="text-base leading-relaxed text-foreground/75 mb-6">
              {isHi
                ? "हमारे नेटवर्क से प्राप्त अधिकांश बीज जैविक होंगे। किसी भी उपज के लिए जो पूरी तरह जैविक नहीं है, हम खरीद से पहले कठोर गुणवत्ता जांच करते हैं। केवल वे बीज जो हमारे उच्च मानकों को पूरा करते हैं, हमारी उत्पादन श्रृंखला में प्रवेश करते हैं।"
                : "Most seeds we receive from our network will be organic. For any produce that is not fully organic, we conduct rigorous quality checks before purchase. Only seeds that meet our high standards enter our production chain."}
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest">
                {isHi ? "मिट्टी का स्वास्थ्य" : "Soil Health"}
              </span>
              <span className="px-4 py-2 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest">
                {isHi ? "शून्य रसायन" : "Zero Chemical Push"}
              </span>
              <span className="px-4 py-2 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest">
                {isHi ? "कठोर जांच" : "Rigorous Checks"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FPO & LIMITED PRODUCTION */}
      <section className="bg-secondary text-secondary-foreground mb-32">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <p className="eyebrow text-primary mb-6">
                {isHi ? "भविष्य" : "THE FUTURE"}
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-black leading-tight mb-8">
                {isHi ? (
                  <>
                    किसानों के लिए <br />
                    <span className="text-primary">एक FPO</span>।
                  </>
                ) : (
                  <>
                    An FPO For <br />
                    <span className="text-primary">Farmers</span>.
                  </>
                )}
              </h2>
              <p className="text-base leading-relaxed opacity-80 mb-6">
                {isHi
                  ? "हमारा संगठन एक किसान उत्पादक संगठन (FPO) बनाने की दिशा में काम कर रहा है। यह हमारे साथी किसानों को सामूहिक सौदेबाजी की शक्ति, बेहतर इनपुट तक पहुंच, और हमारे साथ बढ़ने के लिए एक संरचित मंच देगा।"
                  : "Our organization is working toward forming a Farmer Producer Organization (FPO). This will give our partner farmers collective bargaining power, access to better inputs, and a structured platform to grow with us."}
              </p>
              <p className="text-base leading-relaxed opacity-80">
                {isHi
                  ? "शुरुआत में, हम लगभग 300 किसानों से जुड़ेंगे — कुछ बड़े, कुछ छोटे। उनकी संयुक्त उत्पादन से हम थोड़ा बढ़ पाएंगे, लेकिन यह सीमित रहेगा। हमारा ध्यान बड़े पैमाने पर उत्पादन पर नहीं है। यह गुणवत्ता उत्पादन पर है।"
                  : "In the beginning, we will connect with around 300 farmers — some large, some small. Their combined production will help us scale slightly, but it will remain limited. Our focus is not mass production. It is quality production."}
              </p>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="border border-background/20 p-10 md:p-14">
                <p className="font-display text-2xl md:text-3xl font-bold leading-tight mb-6">
                  {isHi
                    ? "\"उत्पादन सीमित और गुणवत्ता-केंद्रित रहेगा, क्योंकि बाजार में उच्च गुणवत्ता वाले बीज आसानी से उपलब्ध नहीं हैं।\""
                    : "\"Production will remain limited and quality-focused, because high-quality seeds are not easily available in the market.\""}
                </p>
                <p className="text-sm opacity-60 uppercase tracking-widest">
                  {isHi ? "— पक्का देसी दर्शन" : "— Pakka Deshi Philosophy"}
                </p>
              </div>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="bg-background/5 border border-background/10 p-6">
                  <p className="font-display text-sm font-bold uppercase tracking-widest opacity-60 mb-2">
                    {isHi ? "बड़े किसान" : "Large Farmers"}
                  </p>
                  <p className="font-display text-2xl font-black text-primary">
                    {isHi ? "अधिक उपज" : "Higher Yield"}
                  </p>
                </div>
                <div className="bg-background/5 border border-background/10 p-6">
                  <p className="font-display text-sm font-bold uppercase tracking-widest opacity-60 mb-2">
                    {isHi ? "छोटे किसान" : "Small Farmers"}
                  </p>
                  <p className="font-display text-2xl font-black text-primary">
                    {isHi ? "समर्पित खेत" : "Dedicated Plots"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-12 gap-8 items-center border-t border-foreground/20 pt-16">
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl md:text-4xl font-black leading-tight">
              {isHi
                ? "क्या आप बलरामपुर के किसान हैं? शुद्धता के हमारे मिशन में शामिल हों।"
                : "Are you a farmer in Balrampur? Join our mission for purity."}
            </h2>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-[hsl(var(--terracotta-dark))] transition-colors inline-flex items-center gap-2"
            >
              {isHi ? "हमसे जुड़ें" : "Connect With Us"}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FarmersPage;
