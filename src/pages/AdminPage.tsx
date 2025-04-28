
import { Layout } from '@/components/Layout';
import { ActivationCodeGenerator } from '@/components/dashboard/ActivationCodeGenerator';

const AdminPage = () => {
  return (
    <Layout adminOnly>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-muted-foreground mt-1">
          Manage school registrations and activation codes
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivationCodeGenerator />
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Administrator Guide</h3>
            <p className="text-sm text-gray-600 mb-4">
              As the system administrator, you can generate activation codes for new schools to register.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Generated codes can be used by schools during registration</li>
              <li>Each code can only be used once</li>
              <li>Maintain a record of which codes were given to which schools</li>
              <li>For security, codes should be shared through secure channels</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Version</span>
                <span className="text-sm">1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Update</span>
                <span className="text-sm">2025-04-28</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
