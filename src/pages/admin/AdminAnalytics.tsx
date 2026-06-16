import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MessageSquare, Clock, Users, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminAnalytics = () => {
  const { data: chatLogs, isLoading } = useQuery({
    queryKey: ['admin-chat-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const stats = {
    totalChats: chatLogs?.length || 0,
    avgResponseTime: chatLogs?.length 
      ? Math.round(chatLogs.reduce((a, c) => a + (c.response_time_ms || 0), 0) / chatLogs.length)
      : 0,
    whatsappClicks: chatLogs?.filter(c => c.whatsapp_clicked).length || 0,
    uniqueSessions: new Set(chatLogs?.map(c => c.session_id)).size,
  };

  if (isLoading) {
    return <AdminLayout title="Analytics"><div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Chats</p>
                  <p className="text-2xl font-bold">{stats.totalChats}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">{stats.avgResponseTime}ms</p>
                </div>
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unique Sessions</p>
                  <p className="text-2xl font-bold">{stats.uniqueSessions}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp Clicks</p>
                  <p className="text-2xl font-bold">{stats.whatsappClicks}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Chat Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User Message</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Language</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chatLogs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">{new Date(log.created_at).toLocaleString()}</TableCell>
                    <TableCell className="max-w-md truncate">{log.user_message}</TableCell>
                    <TableCell>{log.response_time_ms}ms</TableCell>
                    <TableCell><span className="px-2 py-1 bg-muted rounded text-xs">{log.language}</span></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
