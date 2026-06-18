import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  Building,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useWhatsAppSettings, useSiteSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/hooks/useLanguage";

const ContactPage = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const { data: whatsappSettings } = useWhatsAppSettings();
  const { data: siteSettings } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const whatsappNumber = whatsappSettings?.phone_number?.replace(/\D/g, '') || '917275402632';
  const defaultMessage = language === 'hi' 
    ? (whatsappSettings?.default_message_hi || whatsappSettings?.default_message || '')
    : (whatsappSettings?.default_message || '');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
  const contactEmail = 'anikaedibleoil@outlook.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('enquiries').insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        subject: formData.subject,
        message: formData.message,
        source: 'website',
        enquiry_type: 'general',
      });

      if (error) throw error;

      toast({
        title: language === 'hi' ? "संदेश भेजा गया!" : "Message Sent!",
        description: language === 'hi' 
          ? "हम 24 घंटे के भीतर आपसे संपर्क करेंगे। तेज प्रतिक्रिया के लिए WhatsApp पर संपर्क करें!"
          : "We'll get back to you within 24 hours. For faster response, contact us on WhatsApp!",
      });
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      toast({
        title: language === 'hi' ? "त्रुटि" : "Error",
        description: language === 'hi' 
          ? "संदेश भेजने में समस्या हुई। कृपया पुनः प्रयास करें।"
          : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: language === 'hi' ? "फोन" : "Phone",
      value: whatsappSettings?.phone_number || "+91 72754 02632",
      link: `tel:${whatsappSettings?.phone_number || '+917275402632'}`,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: whatsappSettings?.phone_number || "+91 72754 02632",
      link: whatsappLink,
      highlight: true,
    },
    {
      icon: Mail,
      title: language === 'hi' ? "ईमेल" : "Email",
      value: contactEmail,
      link: `mailto:${contactEmail}`,
    },
    {
      icon: MapPin,
      title: language === 'hi' ? "पता" : "Address",
      value: language === 'hi' ? "गाँव भगवान पुर, जिला बलरामपुर, UP - 271201" : "Village Bhagwan Pur, District Balrampur, UP - 271201",
      link: "https://maps.google.com",
    },
  ];

  const businessHours = [
    { day: language === 'hi' ? "सोमवार - शनिवार" : "Monday - Saturday", time: language === 'hi' ? "सुबह 9:00 - शाम 7:00" : "9:00 AM - 7:00 PM" },
    { day: language === 'hi' ? "रविवार" : "Sunday", time: language === 'hi' ? "सुबह 10:00 - दोपहर 2:00" : "10:00 AM - 2:00 PM" },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-hero-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              {language === 'hi' ? 'संपर्क करें' : 'Contact Us'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
              {language === 'hi' ? 'संपर्क में ' : 'Get in '}
              <span className="text-gradient-gold">{language === 'hi' ? 'रहें' : 'Touch'}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {language === 'hi'
                ? 'हमारे उत्पादों के बारे में सवाल हैं? थोक ऑर्डर देना चाहते हैं? हम आपसे सुनना पसंद करेंगे! सबसे तेज़ प्रतिक्रिया के लिए WhatsApp पर संपर्क करें।'
                : "Have questions about our products? Want to place a bulk order? We'd love to hear from you! Reach out via WhatsApp for fastest response."}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactInfo.map((info) => (
              <a
                key={info.title}
                href={info.link}
                target={info.title === "WhatsApp" ? "_blank" : undefined}
                rel={info.title === "WhatsApp" ? "noopener noreferrer" : undefined}
                className={`p-4 md:p-6 rounded-xl text-center transition-all hover:scale-105 ${
                  info.highlight
                    ? "bg-[hsl(142,70%,45%)] text-[hsl(0,0%,100%)]"
                    : "bg-background hover:bg-primary/5"
                }`}
              >
                <info.icon className={`w-6 h-6 mx-auto mb-2 ${info.highlight ? "" : "text-primary"}`} />
                <p className={`font-semibold text-sm ${info.highlight ? "" : "text-foreground"}`}>
                  {info.title}
                </p>
                <p className={`text-xs mt-1 ${info.highlight ? "opacity-90" : "text-muted-foreground"}`}>
                  {info.value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                {language === 'hi' ? 'हमें संदेश भेजें' : 'Send Us a Message'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {language === 'hi' ? 'आपका नाम *' : 'Your Name *'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        required
                        placeholder={language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {language === 'hi' ? 'फोन नंबर *' : 'Phone Number *'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        required
                        type="tel"
                        placeholder="+91 72754 02632"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {language === 'hi' ? 'विषय *' : 'Subject *'}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      required
                      placeholder={language === 'hi' ? 'हम कैसे मदद कर सकते हैं?' : 'How can we help?'}
                      className="pl-10"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {language === 'hi' ? 'आपका संदेश *' : 'Your Message *'}
                  </label>
                  <Textarea
                    required
                    placeholder={language === 'hi' ? 'अपनी पूछताछ के बारे में और बताएं...' : 'Tell us more about your enquiry...'}
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    language === 'hi' ? "भेजा जा रहा है..." : "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {language === 'hi' ? 'संदेश भेजें' : 'Send Message'}
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-4">
                {language === 'hi' ? 'या तेज़ प्रतिक्रिया के लिए, ' : 'Or for faster response, '}
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {language === 'hi' ? 'WhatsApp पर संदेश भेजें' : 'message us on WhatsApp'}
                </a>
              </p>
            </div>

            {/* Info & Map */}
            <div className="space-y-8">
              {/* Business Hours */}
              <div className="bg-card p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="font-display font-bold text-xl text-foreground">
                    {language === 'hi' ? 'व्यापार के घंटे' : 'Business Hours'}
                  </h3>
                </div>
                <div className="space-y-2">
                  {businessHours.map((hours) => (
                    <div key={hours.day} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{hours.day}</span>
                      <span className="font-medium text-foreground">{hours.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-card p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h3 className="font-display font-bold text-xl text-foreground">
                    {language === 'hi' ? 'हमारा स्थान' : 'Our Location'}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  {language === 'hi' ? (
                    <>
                      पक्का देसी तेल मिल<br />
                      गाँव भगवान पुर, मुख्य बाज़ार के पास<br />
                      जिला बलरामपुर, उत्तर प्रदेश - 271201<br />
                      भारत
                    </>
                  ) : (
                    <>
                      Pakka Deshi Oil Mill<br />
                      Village Bhagwan Pur, Near Main Market<br />
                      District Balrampur, Uttar Pradesh - 271201<br />
                      India
                    </>
                  )}
                </p>
                <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113898.94912344!2d82.05!3d27.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994a8f5e0f2d7d9%3A0x1!2sBalrampur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Pakka Deshi Location"
                  />
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-[hsl(142,70%,45%)] p-6 rounded-2xl text-center">
                <MessageCircle className="w-10 h-10 text-[hsl(0,0%,100%)] mx-auto mb-3" />
                <h3 className="font-display font-bold text-xl text-[hsl(0,0%,100%)] mb-2">
                  {language === 'hi' ? 'WhatsApp पर त्वरित प्रतिक्रिया' : 'Quick Response on WhatsApp'}
                </h3>
                <p className="text-[hsl(0,0%,100%)]/80 text-sm mb-4">
                  {language === 'hi' 
                    ? 'ऑर्डर, प्रश्नों और सहायता के लिए तत्काल जवाब प्राप्त करें'
                    : 'Get instant replies for orders, queries, and support'}
                </p>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg">
                    <MessageCircle className="w-4 h-4" />
                    {language === 'hi' ? 'WhatsApp पर चैट करें' : 'Chat on WhatsApp'}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
