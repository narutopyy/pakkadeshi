import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
  Bot,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [products, posts, enquiries, distributors, chatLogs] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('enquiries').select('id, is_read'),
        supabase.from('distributors').select('id, status'),
        supabase.from('chat_logs').select('id', { count: 'exact', head: true }),
      ]);

      return {
        totalProducts: products.count || 0,
        totalPosts: posts.count || 0,
        totalEnquiries: enquiries.data?.length || 0,
        unreadEnquiries: enquiries.data?.filter(e => !e.is_read).length || 0,
        totalDistributors: distributors.data?.length || 0,
        pendingDistributors: distributors.data?.filter(d => d.status === 'pending').length || 0,
        totalChats: chatLogs.count || 0,
      };
    },
  });

  const { data: recentEnquiries } = useQuery({
    queryKey: ['recent-enquiries'],
    queryFn: async () => {
      const { data } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const { data: aiSettings } = useQuery({
    queryKey: ['ai-settings-status'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_chatbot_settings')
        .select('is_enabled')
        .maybeSingle();
      return data;
    },
  });

  const statCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      change: "",
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Blog Posts",
      value: stats?.totalPosts || 0,
      change: "",
      icon: FileText,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Enquiries",
      value: stats?.totalEnquiries || 0,
      change: stats?.unreadEnquiries ? `${stats.unreadEnquiries} unread` : "",
      icon: MessageSquare,
      color: "bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,45%)]",
    },
    {
      title: "Distributors",
      value: stats?.totalDistributors || 0,
      change: stats?.pendingDistributors ? `${stats.pendingDistributors} pending` : "",
      icon: Users,
      color: "bg-secondary text-secondary-foreground",
    },
  ];

  const quickLinks = [
    { title: "Add Product", path: "/admin/products", icon: Package },
    { title: "Write Blog Post", path: "/admin/blog", icon: FileText },
    { title: "Configure AI Chatbot", path: "/admin/chatbot", icon: Bot },
    { title: "View Analytics", path: "/admin/analytics", icon: TrendingUp },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.change && (
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              )}
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-bold text-lg text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-primary/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium text-foreground">{link.title}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>

          {/* AI Chatbot Status */}
          <div className="bg-card rounded-xl border border-border p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-foreground">AI Chatbot</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                aiSettings?.is_enabled 
                  ? 'bg-accent/20 text-accent' 
                  : 'bg-destructive/20 text-destructive'
              }`}>
                {aiSettings?.is_enabled ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Conversations</span>
                <span className="font-medium text-foreground">{stats?.totalChats || 0}</span>
              </div>
            </div>
            <Link to="/admin/chatbot">
              <button className="w-full mt-4 py-2 text-sm text-primary hover:underline">
                Configure Chatbot →
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-foreground">Recent Enquiries</h3>
              <Link to="/admin/enquiries" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentEnquiries && recentEnquiries.length > 0 ? (
                recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      !enquiry.is_read ? 'bg-primary/5 border border-primary/20' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-display font-bold text-primary">
                          {enquiry.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{enquiry.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {enquiry.message}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">{enquiry.phone || enquiry.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No enquiries yet</p>
              )}
            </div>
          </div>

          {/* Website Stats */}
          <div className="bg-card rounded-xl border border-border p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-foreground">Website Overview</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-display text-2xl font-bold text-foreground">{stats?.totalProducts || 0}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-display text-2xl font-bold text-foreground">{stats?.totalPosts || 0}</p>
                <p className="text-xs text-muted-foreground">Blog Posts</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Bot className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="font-display text-2xl font-bold text-foreground">{stats?.totalChats || 0}</p>
                <p className="text-xs text-muted-foreground">Chat Sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
