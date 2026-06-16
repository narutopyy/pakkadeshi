import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChatbot from "./components/AIChatbot";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ProcessPage from "./pages/ProcessPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import FarmersPage from "./pages/FarmersPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminDistributors from "./pages/admin/AdminDistributors";
import AdminCertifications from "./pages/admin/AdminCertifications";
import AdminWhatsApp from "./pages/admin/AdminWhatsApp";
import AdminChatbot from "./pages/admin/AdminChatbot";
import AdminNavigation from "./pages/admin/AdminNavigation";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminPages from "./pages/admin/AdminPages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout for public pages
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <AIChatbot />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
              <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
              <Route path="/process" element={<PublicLayout><ProcessPage /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
              <Route path="/farmers" element={<PublicLayout><FarmersPage /></PublicLayout>} />
              <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
              <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/pages" element={<AdminPages />} />
              <Route path="/admin/navigation" element={<AdminNavigation />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/videos" element={<AdminVideos />} />
              <Route path="/admin/media" element={<AdminMedia />} />
              <Route path="/admin/enquiries" element={<AdminEnquiries />} />
              <Route path="/admin/distributors" element={<AdminDistributors />} />
              <Route path="/admin/certifications" element={<AdminCertifications />} />
              <Route path="/admin/whatsapp" element={<AdminWhatsApp />} />
              <Route path="/admin/chatbot" element={<AdminChatbot />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
