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
import { Loader2, Plus, Trash2, Edit, Award } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminCertifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', name_hi: '', certificate_number: '', issuing_authority: '',
    certificate_url: '', logo_url: '', valid_from: '', valid_until: '', is_visible: true,
  });

  const { data: certs, isLoading } = useQuery({
    queryKey: ['admin-certifications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('certifications').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('certifications').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
      setIsAddOpen(false);
      resetForm();
      toast({ title: 'Certification added!' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase.from('certifications').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
      setEditing(null);
      resetForm();
      toast({ title: 'Certification updated!' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('certifications').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
      toast({ title: 'Deleted!' });
    },
  });

  const resetForm = () => setFormData({ name: '', name_hi: '', certificate_number: '', issuing_authority: '', certificate_url: '', logo_url: '', valid_from: '', valid_until: '', is_visible: true });

  const openEdit = (cert: any) => {
    setEditing(cert);
    setFormData({
      name: cert.name || '', name_hi: cert.name_hi || '', certificate_number: cert.certificate_number || '',
      issuing_authority: cert.issuing_authority || '', certificate_url: cert.certificate_url || '',
      logo_url: cert.logo_url || '', valid_from: cert.valid_from || '', valid_until: cert.valid_until || '',
      is_visible: cert.is_visible ?? true,
    });
  };

  const handleSubmit = () => {
    const data = { ...formData, valid_from: formData.valid_from || null, valid_until: formData.valid_until || null };
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else addMutation.mutate(data);
  };

  if (isLoading) return <AdminLayout title="Certifications"><div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout title="Certifications">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5" />Certifications ({certs?.length || 0})</CardTitle>
          <Dialog open={isAddOpen || !!editing} onOpenChange={(open) => { if (!open) { setIsAddOpen(false); setEditing(null); resetForm(); } else setIsAddOpen(true); }}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Certification</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Certification</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Name (English)</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="FSSAI License" /></div>
                  <div className="space-y-2"><Label>Name (Hindi)</Label><Input value={formData.name_hi} onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Certificate Number</Label><Input value={formData.certificate_number} onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Issuing Authority</Label><Input value={formData.issuing_authority} onChange={(e) => setFormData({ ...formData, issuing_authority: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Valid From</Label><Input type="date" value={formData.valid_from} onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Valid Until</Label><Input type="date" value={formData.valid_until} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Certificate URL</Label><Input value={formData.certificate_url} onChange={(e) => setFormData({ ...formData, certificate_url: e.target.value })} /></div>
                <div className="flex items-center gap-2"><Switch checked={formData.is_visible} onCheckedChange={(c) => setFormData({ ...formData, is_visible: c })} /><Label>Visible on website</Label></div>
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
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Certificate #</TableHead><TableHead>Authority</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {certs?.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.certificate_number}</TableCell>
                  <TableCell>{c.issuing_authority}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded text-xs ${c.is_visible ? 'bg-accent/20 text-accent' : 'bg-muted'}`}>{c.is_visible ? 'Visible' : 'Hidden'}</span></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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

export default AdminCertifications;
