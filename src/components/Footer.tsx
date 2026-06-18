import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappLink =
    "https://wa.me/917275402632?text=" + encodeURIComponent("Hello Anika Edible Oil!");

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <h3 className="font-display font-black text-4xl uppercase tracking-tighter leading-none">
              Anika Edible Oil
            </h3>
            <p className="eyebrow text-primary mt-3">Balrampur Tradition · Est. 2024</p>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed mt-6 max-w-sm">
              Bringing the authentic taste of traditional cold-pressed
              mustard oil from the heart of Uttar Pradesh to your kitchen.
            </p>
            <div className="flex gap-3 mt-8">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="w-10 h-10 border border-secondary-foreground/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <p className="eyebrow text-secondary-foreground/40 mb-6">Explore</p>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Products", path: "/products" },
                { name: "Process", path: "/process" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="eyebrow text-secondary-foreground/40 mb-6">Reach Us</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span className="text-sm text-secondary-foreground/80">
                  Village Bhagwanpur, District Balrampur,<br />Uttar Pradesh, India<br />Pin Code: 271201
                </span>
              </li>
              <li>
                <a href="tel:+917275402632" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  +91 72754 02632
                </a>
              </li>
              <li>
                <a href="mailto:anikaedibleoil@outlook.com" className="flex items-center gap-3 text-sm hover:text-primary transition-colors break-all">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  anikaedibleoil@outlook.com
                </a>
              </li>
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                  WhatsApp Order
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary-foreground/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="eyebrow text-secondary-foreground/50">
            © {currentYear} Anika Edible Oil — All rights reserved
          </p>
          <div className="flex gap-6 eyebrow">
            <Link to="/privacy" className="text-secondary-foreground/50 hover:text-primary">Privacy</Link>
            <Link to="/terms" className="text-secondary-foreground/50 hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
