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
import { Loader2, Plus, Trash2, Edit, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminBlog = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    title_hi: '',
    excerpt: '',
    excerpt_hi: '',
    content: '',
    content_hi: '',
    featured_image_url: '',
    category_id: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const postData = {
        ...data,
        category_id: data.category_id || null,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
      };
      const { error } = await supabase.from('blog_posts').insert(postData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setIsAddOpen(false);
      resetForm();
      toast({ title: 'Blog post created!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const postData = {
        ...data,
        category_id: data.category_id || null,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
      };
      const { error } = await supabase.from('blog_posts').update(postData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setEditingPost(null);
      resetForm();
      toast({ title: 'Blog post updated!' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Post deleted!' });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: '', title: '', title_hi: '', excerpt: '', excerpt_hi: '',
      content: '', content_hi: '', featured_image_url: '', category_id: '',
      status: 'draft', meta_title: '', meta_description: '',
    });
  };

  const openEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug || '',
      title: post.title || '',
      title_hi: post.title_hi || '',
      excerpt: post.excerpt || '',
      excerpt_hi: post.excerpt_hi || '',
      content: post.content || '',
      content_hi: post.content_hi || '',
      featured_image_url: post.featured_image_url || '',
      category_id: post.category_id || '',
      status: post.status || 'draft',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
    });
  };

  const handleSubmit = () => {
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Blog Posts">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Blog Posts">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Posts ({posts?.length || 0})
          </CardTitle>
          <Dialog open={isAddOpen || !!editingPost} onOpenChange={(open) => {
            if (!open) { setIsAddOpen(false); setEditingPost(null); resetForm(); }
            else setIsAddOpen(true);
          }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> New Post</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit' : 'Create'} Blog Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="my-blog-post"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title (English)</Label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title (Hindi)</Label>
                    <Input value={formData.title_hi} onChange={(e) => setFormData({ ...formData, title_hi: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Featured Image URL</Label>
                    <Input value={formData.featured_image_url} onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Excerpt (English)</Label>
                    <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>Excerpt (Hindi)</Label>
                    <Textarea value={formData.excerpt_hi} onChange={(e) => setFormData({ ...formData, excerpt_hi: e.target.value })} rows={2} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Content (English)</Label>
                  <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={6} />
                </div>
                <div className="space-y-2">
                  <Label>Content (Hindi)</Label>
                  <Textarea value={formData.content_hi} onChange={(e) => setFormData({ ...formData, content_hi: e.target.value })} rows={6} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditingPost(null); resetForm(); }}>Cancel</Button>
                  <Button onClick={handleSubmit} disabled={addMutation.isPending || updateMutation.isPending}>
                    {(addMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingPost ? 'Update' : 'Create'} Post
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
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.blog_categories?.name || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${post.status === 'published' ? 'bg-accent/20 text-accent' : 'bg-muted'}`}>
                      {post.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(post)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(post.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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

export default AdminBlog;
