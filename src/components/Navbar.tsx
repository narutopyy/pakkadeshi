import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { useWhatsAppSettings } from "@/hooks/useSiteSettings";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { data: whatsappSettings } = useWhatsAppSettings();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Process", path: "/process" },
    { name: "Farmers", path: "/farmers" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const whatsappNumber = whatsappSettings?.phone_number?.replace(/\D/g, "") || "917275402632";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello Pakka Deshi! I want to know about your mustard oil."
  )}`;

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Brand wordmark */}
          <Link to="/" className="flex flex-col leading-none min-w-0">
            <span className="font-display font-black text-2xl tracking-tighter uppercase text-foreground">
              Pakka Deshi
            </span>
            <span className="eyebrow text-foreground/60 mt-1 hidden sm:block">
              Est. Balrampur, UP
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[hsl(var(--terracotta-dark))] transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Order WhatsApp
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 -mr-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-6 border-t border-foreground/10 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors ${
                    isActive(link.path)
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 mx-4 px-5 py-3 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full text-center"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
