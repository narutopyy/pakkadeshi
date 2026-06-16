import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Edit, Menu, GripVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminNavigation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ label: '', label_hi: '', url: '', is_external: false, is_visible: true, sort_order: 0 });

  const { data: navItems, isLoading } = useQuery({
    queryKey: ['admin-navigation'],
    queryFn: async () => {
      const { data, error } = await supabase.from('navigation_menu').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('navigation_menu').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      setIsAddOpen(false);
      resetForm();
      toast({ title: 'Menu item added!' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase.from('navigation_menu').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      setEditing(null);
      resetForm();
      toast({ title: 'Menu item updated!' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('navigation_menu').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      toast({ title: 'Deleted!' });
    },
  });

  const resetForm = () => setFormData({ label: '', label_hi: '', url: '', is_external: false, is_visible: true, sort_order: 0 });

  const openEdit = (item: any) => {
    setEditing(item);
    setFormData({
      label: item.label || '', label_hi: item.label_hi || '', url: item.url || '',
      is_external: item.is_external || false, is_visible: item.is_visible ?? true,
      sort_order: item.sort_order || 0,
    });
  };

  const handleSubmit = () => {
    if (editing) updateMutation.mutate({ id: editing.id, data: formData });
    else addMutation.mutate(formData);
  };

  if (isLoading) return <AdminLayout title="Navigation"><div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout title="Navigation">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Menu className="w-5 h-5" />Navigation Menu ({navItems?.length || 0})</CardTitle>
          <Dialog open={isAddOpen || !!editing} onOpenChange={(open) => { if (!open) { setIsAddOpen(false); setEditing(null); resetForm(); } else setIsAddOpen(true); }}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Item</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Menu Item</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Label (English)</Label><Input value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Home" /></div>
                  <div className="space-y-2"><Label>Label (Hindi)</Label><Input value={formData.label_hi} onChange={(e) => setFormData({ ...formData, label_hi: e.target.value })} placeholder="होम" /></div>
                </div>
                <div className="space-y-2"><Label>URL</Label><Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="/" /></div>
                <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} /></div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2"><Switch checked={formData.is_external} onCheckedChange={(c) => setFormData({ ...formData, is_external: c })} /><Label>External Link</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={formData.is_visible} onCheckedChange={(c) => setFormData({ ...formData, is_visible: c })} /><Label>Visible</Label></div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditing(null); resetForm(); }}>Cancel</Button>
                  <Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Label</TableHead><TableHead>URL</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {navItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><GripVertical className="w-4 h-4 text-muted-foreground" />{item.sort_order}</TableCell>
                  <TableCell className="font-medium">{item.label} {item.label_hi && <span className="text-muted-foreground">/ {item.label_hi}</span>}</TableCell>
                  <TableCell>{item.url} {item.is_external && <span className="text-xs bg-muted px-1 rounded">ext</span>}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded text-xs ${item.is_visible ? 'bg-accent/20 text-accent' : 'bg-muted'}`}>{item.is_visible ? 'Visible' : 'Hidden'}</span></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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

export default AdminNavigation;
