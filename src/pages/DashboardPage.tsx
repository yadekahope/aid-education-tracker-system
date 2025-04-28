
import { Layout } from '@/components/Layout';
import { AddStudentForm } from '@/components/dashboard/AddStudentForm';
import { PaymentForm } from '@/components/dashboard/PaymentForm';
import { UnpaidStudentsTable } from '@/components/dashboard/UnpaidStudentsTable';
import { ClassFeeForm } from '@/components/dashboard/ClassFeeForm';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DashboardPage = () => {
  const { user } = useAppContext();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {user?.type === 'administrator' 
            ? `${user.schoolName} Dashboard` 
            : 'System Dashboard'
          }
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage student fees and payments
        </p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students">
          <AddStudentForm />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentForm />
        </TabsContent>
        
        <TabsContent value="unpaid">
          <UnpaidStudentsTable />
        </TabsContent>
        
        <TabsContent value="classes">
          <ClassFeeForm />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default DashboardPage;
