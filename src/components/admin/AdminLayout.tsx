import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Bot,
  Settings,
  BarChart3,
  Users,
  Image,
  LogOut,
  Menu,
  X,
  MessageSquare,
  FileVideo,
  Award,
  Phone,
  Home,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const navItems = [
    { icon: LayoutDashboard, name: "Dashboard", path: "/admin/dashboard" },
    { icon: Settings, name: "Site Settings", path: "/admin/settings" },
    { icon: Home, name: "Pages", path: "/admin/pages" },
    { icon: Globe, name: "Navigation", path: "/admin/navigation" },
    { icon: Package, name: "Products", path: "/admin/products" },
    { icon: FileText, name: "Blog Posts", path: "/admin/blog" },
    { icon: FileVideo, name: "Videos", path: "/admin/videos" },
    { icon: Image, name: "Media", path: "/admin/media" },
    { icon: MessageSquare, name: "Enquiries", path: "/admin/enquiries" },
    { icon: Users, name: "Distributors", path: "/admin/distributors" },
    { icon: Award, name: "Certifications", path: "/admin/certifications" },
    { icon: Phone, name: "WhatsApp", path: "/admin/whatsapp" },
    { icon: Bot, name: "AI Chatbot", path: "/admin/chatbot" },
    { icon: BarChart3, name: "Analytics", path: "/admin/analytics" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const isActive = (path: string) => location.pathname === path;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-secondary text-secondary-foreground h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold">प</span>
          </div>
          <span className="font-display font-bold">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-secondary text-secondary-foreground transform transition-transform duration-300 lg:translate-x-0 overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">प</span>
          </div>
          <div>
            <h1 className="font-display font-bold">Pakka Deshi</h1>
            <p className="text-xs text-secondary-foreground/60">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground/80 hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-secondary-foreground/80 hover:text-secondary-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
          <Link to="/" className="block mt-2">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Website
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        </header>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
