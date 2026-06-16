import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Edit, Video, Play } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminVideos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '', title_hi: '', description: '', description_hi: '',
    youtube_url: '', thumbnail_url: '', category: 'general',
    is_featured: false, is_published: true,
  });

  const { data: videos, isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('videos').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const videoData = { ...data, youtube_id: extractYouTubeId(data.youtube_url) };
      const { error } = await supabase.from('videos').insert(videoData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      setIsAddOpen(false);
      resetForm();
      toast({ title: 'Video added!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const videoData = { ...data, youtube_id: extractYouTubeId(data.youtube_url) };
      const { error } = await supabase.from('videos').update(videoData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      setEditingVideo(null);
      resetForm();
      toast({ title: 'Video updated!' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({ title: 'Video deleted!' });
    },
  });

  const resetForm = () => {
    setFormData({ title: '', title_hi: '', description: '', description_hi: '', youtube_url: '', thumbnail_url: '', category: 'general', is_featured: false, is_published: true });
  };

  const openEdit = (video: any) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || '', title_hi: video.title_hi || '',
      description: video.description || '', description_hi: video.description_hi || '',
      youtube_url: video.youtube_url || '', thumbnail_url: video.thumbnail_url || '',
      category: video.category || 'general', is_featured: video.is_featured || false,
      is_published: video.is_published ?? true,
    });
  };

  const handleSubmit = () => {
    if (editingVideo) updateMutation.mutate({ id: editingVideo.id, data: formData });
    else addMutation.mutate(formData);
  };

  if (isLoading) {
    return <AdminLayout title="Videos"><div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Videos">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Video className="w-5 h-5" />All Videos ({videos?.length || 0})</CardTitle>
          <Dialog open={isAddOpen || !!editingVideo} onOpenChange={(open) => { if (!open) { setIsAddOpen(false); setEditingVideo(null); resetForm(); } else setIsAddOpen(true); }}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Video</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>{editingVideo ? 'Edit' : 'Add'} Video</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Title (English)</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Title (Hindi)</Label><Input value={formData.title_hi} onChange={(e) => setFormData({ ...formData, title_hi: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>YouTube URL</Label><Input value={formData.youtube_url} onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." /></div>
                <div className="space-y-2"><Label>Custom Thumbnail URL (optional)</Label><Input value={formData.thumbnail_url} onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Description (English)</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
                  <div className="space-y-2"><Label>Description (Hindi)</Label><Textarea value={formData.description_hi} onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })} rows={3} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md bg-background">
                    <option value="general">General</option>
                    <option value="process">Process</option>
                    <option value="testimonial">Testimonial</option>
                    <option value="recipe">Recipe</option>
                  </select>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2"><Switch checked={formData.is_featured} onCheckedChange={(c) => setFormData({ ...formData, is_featured: c })} /><Label>Featured</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={formData.is_published} onCheckedChange={(c) => setFormData({ ...formData, is_published: c })} /><Label>Published</Label></div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditingVideo(null); resetForm(); }}>Cancel</Button>
                  <Button onClick={handleSubmit} disabled={addMutation.isPending || updateMutation.isPending}>
                    {(addMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingVideo ? 'Update' : 'Add'} Video
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos?.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-12 bg-muted rounded overflow-hidden">
                        {video.youtube_id && <img src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`} alt="" className="w-full h-full object-cover" />}
                        <Play className="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow" />
                      </div>
                      <span className="font-medium">{video.title}</span>
                    </div>
                  </TableCell>
                  <TableCell><span className="px-2 py-1 bg-muted rounded text-xs">{video.category}</span></TableCell>
                  <TableCell><span className={`px-2 py-1 rounded text-xs ${video.is_published ? 'bg-accent/20 text-accent' : 'bg-muted'}`}>{video.is_published ? 'Published' : 'Draft'}</span></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(video)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(video.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminVideos;
