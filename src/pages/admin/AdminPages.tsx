import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

const AdminPages = () => {
  return (
    <AdminLayout title="Pages">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Page Builder
            </CardTitle>
            <CardDescription>Create and manage custom pages with drag-and-drop sections</CardDescription>
          </div>
          <Button><Plus className="w-4 h-4 mr-2" /> Create Page</Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Page Builder Coming Soon</h3>
            <p className="text-sm max-w-md mx-auto">
              The full page builder with drag-and-drop sections, custom layouts, and SEO settings will be available in the next update.
            </p>
            <p className="text-sm mt-4">
              Current pages (Home, About, Products, Process, Contact) are configured in code but fetch content from the database.
            </p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminPages;
