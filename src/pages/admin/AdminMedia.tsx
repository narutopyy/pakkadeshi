import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Trash2, Image, FileText, Copy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminMedia = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const { data: media, isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

        await supabase.from('media').insert({
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: user?.id,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast({ title: 'Files uploaded successfully!' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (item: any) => {
      // Extract path from URL
      const path = item.file_url.split('/storage/v1/object/public/media/')[1];
      if (path) {
        await supabase.storage.from('media').remove([path]);
      }
      const { error } = await supabase.from('media').delete().eq('id', item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast({ title: 'File deleted!' });
    },
  });

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: 'URL copied to clipboard!' });
  };

  const isImage = (type: string) => type?.startsWith('image/');

  if (isLoading) {
    return <AdminLayout title="Media Library"><div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Media Library">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Image className="w-5 h-5" />Media Library ({media?.length || 0})</CardTitle>
          <div>
            <Input type="file" id="file-upload" multiple accept="image/*,.pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
            <Button asChild disabled={uploading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload Files
              </label>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {media && media.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.map((item) => (
                <div key={item.id} className="group relative border rounded-lg overflow-hidden bg-muted">
                  <div className="aspect-square flex items-center justify-center">
                    {isImage(item.file_type) ? (
                      <img src={item.file_url} alt={item.alt_text || item.file_name} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => copyUrl(item.file_url)}><Copy className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(item)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <p className="p-2 text-xs truncate">{item.file_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No media files yet. Upload some files to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminMedia;
