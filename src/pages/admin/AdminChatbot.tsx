import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Plus, Trash2, Bot, MessageSquare, Zap, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminChatbot = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddKBOpen, setIsAddKBOpen] = useState(false);
  const [newKB, setNewKB] = useState({ title: '', content: '', content_hi: '', category: 'general', keywords: '' });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-ai-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ai_chatbot_settings').select('*').maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: knowledgeBase } = useQuery({
    queryKey: ['admin-knowledge-base'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ai_knowledge_base').select('*').order('priority', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: chatStats } = useQuery({
    queryKey: ['chat-stats'],
    queryFn: async () => {
      const { data, count } = await supabase.from('chat_logs').select('*', { count: 'exact' });
      const today = new Date().toISOString().split('T')[0];
      const todayCount = data?.filter(c => c.created_at?.startsWith(today)).length || 0;
      return {
        total: count || 0,
        today: todayCount,
        avgResponseTime: data?.length ? Math.round(data.reduce((a, c) => a + (c.response_time_ms || 0), 0) / data.length) : 0,
      };
    },
  });

  const [formData, setFormData] = useState<any>(null);
  if (settings && !formData) setFormData(settings);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      if (settings?.id) {
        const { error } = await supabase.from('ai_chatbot_settings').update(data).eq('id', settings.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ai-settings'] });
      toast({ title: 'AI settings saved!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const addKBMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('ai_knowledge_base').insert({
        ...data,
        keywords: data.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-knowledge-base'] });
      setIsAddKBOpen(false);
      setNewKB({ title: '', content: '', content_hi: '', category: 'general', keywords: '' });
      toast({ title: 'Knowledge entry added!' });
    },
  });

  const deleteKBMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('ai_knowledge_base').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-knowledge-base'] });
      toast({ title: 'Entry deleted!' });
    },
  });

  if (isLoading) {
    return <AdminLayout title="AI Chatbot"><div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="AI Chatbot">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Status</p><p className={`text-lg font-bold ${formData?.is_enabled ? 'text-accent' : 'text-destructive'}`}>{formData?.is_enabled ? 'Active' : 'Inactive'}</p></div><Bot className={`w-8 h-8 ${formData?.is_enabled ? 'text-accent' : 'text-muted-foreground'}`} /></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Chats</p><p className="text-2xl font-bold">{chatStats?.total || 0}</p></div><MessageSquare className="w-8 h-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Today</p><p className="text-2xl font-bold">{chatStats?.today || 0}</p></div><Zap className="w-8 h-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Avg Response</p><p className="text-2xl font-bold">{chatStats?.avgResponseTime || 0}ms</p></div><BarChart3 className="w-8 h-8 text-accent" /></div></CardContent></Card>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList><TabsTrigger value="settings">Settings</TabsTrigger><TabsTrigger value="knowledge">Knowledge Base</TabsTrigger><TabsTrigger value="messages">Messages</TabsTrigger></TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader><CardTitle>Chatbot Configuration</CardTitle><CardDescription>Control how the AI chatbot behaves</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div><Label className="text-base">Enable Chatbot</Label><p className="text-sm text-muted-foreground">Show the floating chatbot on your website</p></div>
                <Switch checked={formData?.is_enabled || false} onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })} />
              </div>
              <div className="space-y-2">
                <Label>Conversation Tone</Label>
                <select value={formData?.tone || 'desi'} onChange={(e) => setFormData({ ...formData, tone: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md bg-background">
                  <option value="desi">Desi (Traditional Indian)</option>
                  <option value="neutral">Neutral</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>System Prompt</Label>
                <Textarea value={formData?.system_prompt || ''} onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })} rows={5} />
                <p className="text-xs text-muted-foreground">This defines the AI's personality and behavior</p>
              </div>
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium">WhatsApp CTA</h4>
                <div className="flex items-center justify-between">
                  <div><Label>Show WhatsApp Button</Label><p className="text-sm text-muted-foreground">Display WhatsApp CTA in chat responses</p></div>
                  <Switch checked={formData?.whatsapp_cta_enabled || false} onCheckedChange={(checked) => setFormData({ ...formData, whatsapp_cta_enabled: checked })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>CTA Text (English)</Label><Input value={formData?.whatsapp_cta_text || ''} onChange={(e) => setFormData({ ...formData, whatsapp_cta_text: e.target.value })} /></div>
                  <div className="space-y-2"><Label>CTA Text (Hindi)</Label><Input value={formData?.whatsapp_cta_text_hi || ''} onChange={(e) => setFormData({ ...formData, whatsapp_cta_text_hi: e.target.value })} /></div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => updateSettingsMutation.mutate(formData)} disabled={updateSettingsMutation.isPending}>
                  {updateSettingsMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Knowledge Base</CardTitle><CardDescription>Information the AI uses to answer questions</CardDescription></div>
              <Dialog open={isAddKBOpen} onOpenChange={setIsAddKBOpen}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Entry</Button></DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader><DialogTitle>Add Knowledge Entry</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2"><Label>Title</Label><Input value={newKB.title} onChange={(e) => setNewKB({ ...newKB, title: e.target.value })} /></div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select value={newKB.category} onChange={(e) => setNewKB({ ...newKB, category: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md bg-background">
                        <option value="general">General</option><option value="about">About</option><option value="products">Products</option><option value="process">Process</option><option value="benefits">Benefits</option><option value="ordering">Ordering</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Content (English)</Label><Textarea value={newKB.content} onChange={(e) => setNewKB({ ...newKB, content: e.target.value })} rows={4} /></div>
                    <div className="space-y-2"><Label>Content (Hindi)</Label><Textarea value={newKB.content_hi} onChange={(e) => setNewKB({ ...newKB, content_hi: e.target.value })} rows={4} /></div>
                    <div className="space-y-2"><Label>Keywords (comma separated)</Label><Input value={newKB.keywords} onChange={(e) => setNewKB({ ...newKB, keywords: e.target.value })} /></div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddKBOpen(false)}>Cancel</Button>
                      <Button onClick={() => addKBMutation.mutate(newKB)} disabled={addKBMutation.isPending}>Add Entry</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Keywords</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {knowledgeBase?.map((kb) => (
                    <TableRow key={kb.id}>
                      <TableCell className="font-medium">{kb.title}</TableCell>
                      <TableCell><span className="px-2 py-1 bg-muted rounded text-xs">{kb.category}</span></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{kb.keywords?.slice(0, 3).join(', ')}{kb.keywords && kb.keywords.length > 3 && '...'}</TableCell>
                      <TableCell><span className={`px-2 py-1 rounded text-xs ${kb.is_active ? 'bg-accent/20 text-accent' : 'bg-muted'}`}>{kb.is_active ? 'Active' : 'Inactive'}</span></TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => deleteKBMutation.mutate(kb.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader><CardTitle>Greeting & Fallback Messages</CardTitle><CardDescription>Customize the chatbot's default messages</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Greeting (English)</Label><Textarea value={formData?.greeting_message || ''} onChange={(e) => setFormData({ ...formData, greeting_message: e.target.value })} rows={3} /></div>
                <div className="space-y-2"><Label>Greeting (Hindi)</Label><Textarea value={formData?.greeting_message_hi || ''} onChange={(e) => setFormData({ ...formData, greeting_message_hi: e.target.value })} rows={3} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Fallback Message (English)</Label><Textarea value={formData?.fallback_message || ''} onChange={(e) => setFormData({ ...formData, fallback_message: e.target.value })} rows={3} /></div>
                <div className="space-y-2"><Label>Fallback Message (Hindi)</Label><Textarea value={formData?.fallback_message_hi || ''} onChange={(e) => setFormData({ ...formData, fallback_message_hi: e.target.value })} rows={3} /></div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => updateSettingsMutation.mutate(formData)} disabled={updateSettingsMutation.isPending}>
                  {updateSettingsMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminChatbot;
