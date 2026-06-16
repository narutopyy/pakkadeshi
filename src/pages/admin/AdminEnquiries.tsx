import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, X, Eye, Mail, Phone, MessageSquare } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

const AdminEnquiries = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

  const { data: enquiries, isLoading } = useQuery({
    queryKey: ['admin-enquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('enquiries')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-enquiries'] });
    },
  });

  const markRepliedMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('enquiries')
        .update({ is_replied: true, replied_at: new Date().toISOString(), notes })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-enquiries'] });
      setSelectedEnquiry(null);
      toast({ title: 'Marked as replied!' });
    },
  });

  const openEnquiry = (enquiry: any) => {
    setSelectedEnquiry(enquiry);
    if (!enquiry.is_read) {
      markReadMutation.mutate(enquiry.id);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Enquiries">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const unreadCount = enquiries?.filter(e => !e.is_read).length || 0;

  return (
    <AdminLayout title="Enquiries">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              All Enquiries ({enquiries?.length || 0})
            </span>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">
                {unreadCount} unread
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries?.map((enquiry) => (
                <TableRow key={enquiry.id} className={!enquiry.is_read ? 'bg-primary/5' : ''}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {!enquiry.is_read && (
                        <span className="w-2 h-2 bg-primary rounded-full" />
                      )}
                      {enquiry.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {enquiry.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" /> {enquiry.email}
                        </div>
                      )}
                      {enquiry.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" /> {enquiry.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{enquiry.subject || enquiry.enquiry_type}</TableCell>
                  <TableCell>{new Date(enquiry.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {enquiry.is_replied ? (
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs flex items-center gap-1 w-fit">
                        <Check className="w-3 h-3" /> Replied
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-muted rounded text-xs">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEnquiry(enquiry)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedEnquiry} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedEnquiry.created_at).toLocaleString()}</p>
                </div>
                {selectedEnquiry.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedEnquiry.email}</p>
                  </div>
                )}
                {selectedEnquiry.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedEnquiry.phone}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="p-3 bg-muted rounded-lg mt-1">{selectedEnquiry.message}</p>
              </div>
              {selectedEnquiry.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="p-3 bg-muted rounded-lg mt-1">{selectedEnquiry.notes}</p>
                </div>
              )}
              {!selectedEnquiry.is_replied && (
                <div className="space-y-2">
                  <Textarea
                    id="notes"
                    placeholder="Add notes about your response..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    {selectedEnquiry.phone && (
                      <Button
                        variant="whatsapp"
                        onClick={() => window.open(`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}`, '_blank')}
                      >
                        Reply on WhatsApp
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        const notes = (document.getElementById('notes') as HTMLTextAreaElement)?.value || '';
                        markRepliedMutation.mutate({ id: selectedEnquiry.id, notes });
                      }}
                    >
                      Mark as Replied
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEnquiries;
