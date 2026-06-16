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
import { Loader2, Plus, Trash2, Edit, Package, IndianRupee } from 'lucide-react';
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

const AdminProducts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    name_hi: '',
    short_description: '',
    short_description_hi: '',
    full_description: '',
    full_description_hi: '',
    base_price: '',
    discount_price: '',
    images: '',
    is_featured: false,
    is_available: true,
    is_published: true,
    whatsapp_message: '',
    whatsapp_message_hi: '',
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const productData = {
        ...data,
        base_price: parseFloat(data.base_price) || null,
        discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
        images: data.images ? data.images.split(',').map((i: string) => i.trim()) : [],
      };
      const { error } = await supabase.from('products').insert(productData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsAddOpen(false);
      resetForm();
      toast({ title: 'Product added!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const productData = {
        ...data,
        base_price: parseFloat(data.base_price) || null,
        discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
        images: data.images ? (typeof data.images === 'string' ? data.images.split(',').map((i: string) => i.trim()) : data.images) : [],
      };
      const { error } = await supabase.from('products').update(productData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setEditingProduct(null);
      resetForm();
      toast({ title: 'Product updated!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product deleted!' });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      name: '',
      name_hi: '',
      short_description: '',
      short_description_hi: '',
      full_description: '',
      full_description_hi: '',
      base_price: '',
      discount_price: '',
      images: '',
      is_featured: false,
      is_available: true,
      is_published: true,
      whatsapp_message: '',
      whatsapp_message_hi: '',
    });
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      slug: product.slug || '',
      name: product.name || '',
      name_hi: product.name_hi || '',
      short_description: product.short_description || '',
      short_description_hi: product.short_description_hi || '',
      full_description: product.full_description || '',
      full_description_hi: product.full_description_hi || '',
      base_price: product.base_price?.toString() || '',
      discount_price: product.discount_price?.toString() || '',
      images: product.images?.join(', ') || '',
      is_featured: product.is_featured || false,
      is_available: product.is_available ?? true,
      is_published: product.is_published ?? true,
      whatsapp_message: product.whatsapp_message || '',
      whatsapp_message_hi: product.whatsapp_message_hi || '',
    });
  };

  const handleSubmit = () => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const ProductForm = () => (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Slug (URL)</Label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            placeholder="pure-mustard-oil-1l"
          />
        </div>
        <div className="space-y-2">
          <Label>Name (English)</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Pure Mustard Oil - 1L"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Name (Hindi)</Label>
        <Input
          value={formData.name_hi}
          onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
          placeholder="शुद्ध सरसों तेल - 1 लीटर"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Short Description (English)</Label>
          <Textarea
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Short Description (Hindi)</Label>
          <Textarea
            value={formData.short_description_hi}
            onChange={(e) => setFormData({ ...formData, short_description_hi: e.target.value })}
            rows={2}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Base Price (₹)</Label>
          <Input
            type="number"
            value={formData.base_price}
            onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
            placeholder="299"
          />
        </div>
        <div className="space-y-2">
          <Label>Discount Price (₹)</Label>
          <Input
            type="number"
            value={formData.discount_price}
            onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
            placeholder="249"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Images (comma-separated URLs)</Label>
        <Textarea
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label>WhatsApp Message (English)</Label>
        <Input
          value={formData.whatsapp_message}
          onChange={(e) => setFormData({ ...formData, whatsapp_message: e.target.value })}
          placeholder="Hi, I want to order..."
        />
      </div>
      <div className="space-y-2">
        <Label>WhatsApp Message (Hindi)</Label>
        <Input
          value={formData.whatsapp_message_hi}
          onChange={(e) => setFormData({ ...formData, whatsapp_message_hi: e.target.value })}
          placeholder="नमस्ते, मैं ऑर्डर करना चाहता हूं..."
        />
      </div>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
          />
          <Label>Featured</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.is_available}
            onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
          />
          <Label>Available</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
          />
          <Label>Published</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditingProduct(null); resetForm(); }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={addMutation.isPending || updateMutation.isPending}>
          {(addMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {editingProduct ? 'Update' : 'Add'} Product
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout title="Products">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            All Products ({products?.length || 0})
          </CardTitle>
          <Dialog open={isAddOpen || !!editingProduct} onOpenChange={(open) => { 
            if (!open) { setIsAddOpen(false); setEditingProduct(null); resetForm(); }
            else setIsAddOpen(true);
          }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit' : 'Add'} Product</DialogTitle>
              </DialogHeader>
              <ProductForm />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt="" className="w-12 h-12 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {product.discount_price ? (
                        <>
                          <span className="line-through text-muted-foreground text-sm">{product.base_price}</span>
                          <span className="font-medium text-accent">{product.discount_price}</span>
                        </>
                      ) : (
                        <span className="font-medium">{product.base_price}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.is_published ? 'bg-accent/20 text-accent' : 'bg-muted'
                    }`}>
                      {product.is_published ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.is_featured && (
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">Featured</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(product.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
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

export default AdminProducts;
