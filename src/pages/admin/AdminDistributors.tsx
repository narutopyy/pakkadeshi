import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, X, Users, Building, Phone, Mail } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

const AdminDistributors = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<any>(null);

  const { data: distributors, isLoading } = useQuery({
    queryKey: ['admin-distributors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('distributors').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase.from('distributors').update({ status, notes, is_approved: status === 'approved' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-distributors'] });
      setSelected(null);
      toast({ title: 'Status updated!' });
    },
  });

  const pendingCount = distributors?.filter(d => d.status === 'pending').length || 0;

  if (isLoading) {
    return <AdminLayout title="Distributors"><div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Distributors">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Users className="w-5 h-5" />Distributor Applications ({distributors?.length || 0})</span>
            {pendingCount > 0 && <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">{pendingCount} pending</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributors?.map((d) => (
                <TableRow key={d.id} className={d.status === 'pending' ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{d.company_name}</p>
                        <p className="text-sm text-muted-foreground">{d.contact_person}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm"><Phone className="w-3 h-3" />{d.phone}</div>
                      {d.email && <div className="flex items-center gap-1 text-sm"><Mail className="w-3 h-3" />{d.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{d.city}, {d.state}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      d.status === 'approved' ? 'bg-accent/20 text-accent' :
                      d.status === 'rejected' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
                    }`}>{d.status}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(d)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Distributor Application</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Company</p><p className="font-medium">{selected.company_name}</p></div>
                <div><p className="text-sm text-muted-foreground">Contact Person</p><p className="font-medium">{selected.contact_person}</p></div>
                <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{selected.phone}</p></div>
                <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{selected.email || '-'}</p></div>
                <div><p className="text-sm text-muted-foreground">Location</p><p className="font-medium">{selected.city}, {selected.state} - {selected.pincode}</p></div>
                <div><p className="text-sm text-muted-foreground">GST Number</p><p className="font-medium">{selected.gst_number || '-'}</p></div>
              </div>
              {selected.address && <div><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{selected.address}</p></div>}
              {selected.expected_quantity && <div><p className="text-sm text-muted-foreground">Expected Quantity</p><p className="font-medium">{selected.expected_quantity}</p></div>}
              {selected.message && <div><p className="text-sm text-muted-foreground">Message</p><p className="p-3 bg-muted rounded-lg">{selected.message}</p></div>}
              {selected.status === 'pending' && (
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => updateStatusMutation.mutate({ id: selected.id, status: 'rejected' })}>
                    <X className="w-4 h-4 mr-2" /> Reject
                  </Button>
                  <Button className="flex-1" onClick={() => updateStatusMutation.mutate({ id: selected.id, status: 'approved' })}>
                    <Check className="w-4 h-4 mr-2" /> Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDistributors;
