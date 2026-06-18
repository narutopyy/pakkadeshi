import { Button } from "@/components/ui/button";
import { MessageCircle, Package, Star, Truck, ShieldCheck, Droplets } from "lucide-react";
import bottleFrontAsset from "@/assets/pakka-deshi-bottle-front.png";
import bottleBackAsset from "@/assets/pakka-deshi-bottle-back.png";
import bottleNaturalAsset from "@/assets/pakka-deshi-bottle-natural.png";
import bottleHeroAsset from "@/assets/pakka-deshi-bottle-hero.png";

const productImages = [bottleFrontAsset, bottleBackAsset, bottleNaturalAsset, bottleHeroAsset];
import { useProducts, useWhatsAppSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/hooks/useLanguage";

const ProductsPage = () => {
  const { language } = useLanguage();
  const { data: products, isLoading } = useProducts();
  const { data: whatsappSettings } = useWhatsAppSettings();

  const whatsappNumber = whatsappSettings?.phone_number?.replace(/\D/g, '') || '917275402632';

  const getWhatsappLink = (productName: string) => {
    const message = language === 'hi'
      ? (whatsappSettings?.product_inquiry_message_hi || whatsappSettings?.product_inquiry_message || '')
      : (whatsappSettings?.product_inquiry_message || '');
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message.replace('{{product_name}}', productName))}`;
  };

  const bulkWhatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    language === 'hi' 
      ? (whatsappSettings?.bulk_order_message_hi || whatsappSettings?.bulk_order_message || '')
      : (whatsappSettings?.bulk_order_message || '')
  )}`;

  const bulkProducts = [
    {
      name: language === 'hi' ? "सरसों खली" : "Mustard Cake (Khali)",
      description: language === 'hi' 
        ? "जैविक उर्वरक और पशु चारा। हमारे तेल निष्कर्षण का उप-उत्पाद।"
        : "Organic fertilizer and cattle feed. By-product of our oil extraction.",
      price: "₹25/kg",
      minOrder: language === 'hi' ? "न्यूनतम 50 किलो" : "Minimum 50kg",
    },
    {
      name: language === 'hi' ? "थोक तेल ऑर्डर" : "Bulk Oil Orders",
      description: language === 'hi'
        ? "रेस्तरां, कैटरर्स और व्यवसायों के लिए। विशेष थोक दरें।"
        : "For restaurants, caterers, and businesses. Special wholesale rates.",
      price: language === 'hi' ? "मूल्य के लिए संपर्क करें" : "Contact for pricing",
      minOrder: language === 'hi' ? "न्यूनतम 50 लीटर" : "Minimum 50 Litres",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-hero-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              {language === 'hi' ? 'हमारे उत्पाद' : 'Our Products'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
              {language === 'hi' ? 'शुद्ध और प्राकृतिक ' : 'Pure & Natural '}
              <span className="text-gradient-gold">{language === 'hi' ? 'तेल' : 'Oils'}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {language === 'hi'
                ? 'अनिका एडिबल ऑयल की हर बोतल शुद्धता, परंपरा और प्रामाणिक स्वाद का वादा है।'
                : 'Each bottle of Anika Edible Oil is a promise of purity, tradition, and authentic taste.'}
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: Droplets, text: language === 'hi' ? "100% कोल्ड प्रेस्ड" : "100% Cold Pressed" },
              { icon: ShieldCheck, text: language === 'hi' ? "कोई रसायन नहीं, अपरिष्कृत" : "No Chemicals, Unrefined" },
              { icon: Package, text: language === 'hi' ? "अनप्रोसेस्ड, कोई परिरक्षक नहीं" : "Unprocessed, No Preservatives" },
              { icon: Truck, text: language === 'hi' ? "पूरे भारत में डिलीवरी" : "All India Delivery" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-muted-foreground">
                <badge.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-16">
              {products?.map((product, productIdx) => (
                <div
                  key={product.id}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                    productIdx % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div className={productIdx % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="relative">
                      <img
                        src={product.images?.[0] || productImages[productIdx % productImages.length]}
                        alt={language === 'hi' ? (product.name_hi || product.name) : product.name}
                        className="w-full max-w-md mx-auto rounded-2xl shadow-elevated"
                      />
                      {product.is_featured && (
                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {language === 'hi' ? 'बेस्टसेलर' : 'Bestseller'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className={productIdx % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="bg-card p-6 md:p-8 rounded-2xl border border-border">
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                        {language === 'hi' ? (product.name_hi || product.name) : product.name}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {language === 'hi' 
                          ? (product.short_description_hi || product.short_description)
                          : product.short_description}
                      </p>

                      {/* Variants */}
                      {product.product_variants && product.product_variants.length > 0 && (
                        <div className="space-y-3 mb-6">
                          <h4 className="font-semibold text-foreground">
                            {language === 'hi' ? 'उपलब्ध आकार:' : 'Available Sizes:'}
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {product.product_variants.map((variant) => (
                              <div
                                key={variant.id}
                                className={`p-4 rounded-xl border-2 transition-colors ${
                                  variant.sort_order === 0
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                {variant.sort_order === 0 && (
                                  <span className="text-xs text-primary font-medium">
                                    {language === 'hi' ? 'सबसे लोकप्रिय' : 'Most Popular'}
                                  </span>
                                )}
                                <p className="font-display font-bold text-lg text-foreground">
                                  {variant.size || (language === 'hi' ? (variant.name_hi || variant.name) : variant.name)}
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                  ₹{variant.discount_price || variant.price}
                                </p>
                                {variant.discount_price && variant.price !== variant.discount_price && (
                                  <p className="text-sm text-muted-foreground line-through">₹{variant.price}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Order Button */}
                      <a href={getWhatsappLink(product.name)} target="_blank" rel="noopener noreferrer">
                        <Button variant="whatsapp" size="lg" className="w-full">
                          <MessageCircle className="w-5 h-5" />
                          {language === 'hi' ? 'WhatsApp पर ऑर्डर करें' : 'Order on WhatsApp'}
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bulk Orders */}
      <section className="py-16 md:py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {language === 'hi' ? 'थोक और होलसेल ऑर्डर' : 'Bulk & Wholesale Orders'}
            </h2>
            <p className="text-secondary-foreground/80">
              {language === 'hi' 
                ? 'व्यवसायों, रेस्तरां और बड़े ऑर्डर के लिए विशेष दरें'
                : 'Special rates for businesses, restaurants, and large orders'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {bulkProducts.map((product) => (
              <div key={product.name} className="bg-background text-foreground p-6 rounded-2xl">
                <h3 className="font-display font-bold text-xl mb-2">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-primary">{product.price}</p>
                    <p className="text-xs text-muted-foreground">{product.minOrder}</p>
                  </div>
                  <a href={bulkWhatsappLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      {language === 'hi' ? 'पूछताछ करें' : 'Enquire'}
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'hi' ? 'हजारों लोगों का पसंदीदा' : 'Loved by Thousands'}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-muted-foreground">
                {language === 'hi' ? '2000+ समीक्षाओं में 4.9/5' : '4.9/5 from 2000+ reviews'}
              </span>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://share.google/rffQvMdXnvVG7miNT"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                {language === 'hi' ? 'अपनी समीक्षा साझा करें' : 'Share Your Review'}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
