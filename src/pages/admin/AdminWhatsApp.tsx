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
import { Loader2, Save, Phone, MessageCircle } from 'lucide-react';

const AdminWhatsApp = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-whatsapp-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('whatsapp_settings')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState<any>(null);

  if (settings && !formData) {
    setFormData(settings);
  }

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (settings?.id) {
        const { error } = await supabase
          .from('whatsapp_settings')
          .update(data)
          .eq('id', settings.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-whatsapp-settings'] });
      queryClient.invalidateQueries({ queryKey: ['whatsapp-settings'] });
      toast({ title: 'WhatsApp settings saved!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  if (isLoading) {
    return (
      <AdminLayout title="WhatsApp Settings">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="WhatsApp Settings">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              WhatsApp Configuration
            </CardTitle>
            <CardDescription>Configure WhatsApp integration for your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label className="text-base">Enable WhatsApp</Label>
                <p className="text-sm text-muted-foreground">Show WhatsApp buttons across the website</p>
              </div>
              <Switch
                checked={formData?.is_enabled || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">WhatsApp Number</Label>
              <Input
                id="phone_number"
                value={formData?.phone_number || ''}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="+919876543210"
              />
              <p className="text-xs text-muted-foreground">Include country code (e.g., +91 for India)</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label className="text-base">Floating Button</Label>
                <p className="text-sm text-muted-foreground">Show floating WhatsApp button on all pages</p>
              </div>
              <Switch
                checked={formData?.show_floating_button || false}
                onCheckedChange={(checked) => setFormData({ ...formData, show_floating_button: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label>Button Position</Label>
              <select
                value={formData?.button_position || 'bottom-right'}
                onChange={(e) => setFormData({ ...formData, button_position: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Pre-filled Messages
            </CardTitle>
            <CardDescription>Customize the default messages for different scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Message (English)</Label>
                <Textarea
                  value={formData?.default_message || ''}
                  onChange={(e) => setFormData({ ...formData, default_message: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Message (Hindi)</Label>
                <Textarea
                  value={formData?.default_message_hi || ''}
                  onChange={(e) => setFormData({ ...formData, default_message_hi: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Inquiry (English)</Label>
                <Textarea
                  value={formData?.product_inquiry_message || ''}
                  onChange={(e) => setFormData({ ...formData, product_inquiry_message: e.target.value })}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">Use {"{{product_name}}"} as placeholder</p>
              </div>
              <div className="space-y-2">
                <Label>Product Inquiry (Hindi)</Label>
                <Textarea
                  value={formData?.product_inquiry_message_hi || ''}
                  onChange={(e) => setFormData({ ...formData, product_inquiry_message_hi: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bulk Order (English)</Label>
                <Textarea
                  value={formData?.bulk_order_message || ''}
                  onChange={(e) => setFormData({ ...formData, bulk_order_message: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Bulk Order (Hindi)</Label>
                <Textarea
                  value={formData?.bulk_order_message_hi || ''}
                  onChange={(e) => setFormData({ ...formData, bulk_order_message_hi: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Distributor Inquiry (English)</Label>
                <Textarea
                  value={formData?.distributor_message || ''}
                  onChange={(e) => setFormData({ ...formData, distributor_message: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Distributor Inquiry (Hindi)</Label>
                <Textarea
                  value={formData?.distributor_message_hi || ''}
                  onChange={(e) => setFormData({ ...formData, distributor_message_hi: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => updateMutation.mutate(formData)} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminWhatsApp;
