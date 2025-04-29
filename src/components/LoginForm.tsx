
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const { login, adminLogin } = useAppContext();
  const [activeTab, setActiveTab] = useState('school');
  const navigate = useNavigate();
  
  // School login state
  const [schoolName, setSchoolName] = useState('');
  const [schoolPassword, setSchoolPassword] = useState('');
  
  // Admin login state
  const [adminPassword, setAdminPassword] = useState('');

  const handleSchoolLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(schoolName, schoolPassword);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await adminLogin(adminPassword);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-education-background">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-education-primary">AID EDUCATION TECH</h1>
          <p className="text-education-muted mt-2">School Fee Management System</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Access your school fee management dashboard
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="school">School Admin</TabsTrigger>
              <TabsTrigger value="admin">System Admin</TabsTrigger>
              <TabsTrigger value="parent">Parent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="school">
              <form onSubmit={handleSchoolLogin}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input 
                      id="schoolName" 
                      value={schoolName} 
                      onChange={(e) => setSchoolName(e.target.value)} 
                      required 
                      placeholder="Enter your school name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolPassword">Password</Label>
                    <Input 
                      id="schoolPassword" 
                      type="password" 
                      value={schoolPassword} 
                      onChange={(e) => setSchoolPassword(e.target.value)} 
                      required 
                      placeholder="Enter your password"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-education-primary hover:bg-education-secondary">
                    Login
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Admin Password</Label>
                    <Input 
                      id="adminPassword" 
                      type="password" 
                      value={adminPassword} 
                      onChange={(e) => setAdminPassword(e.target.value)} 
                      required 
                      placeholder="Enter admin password"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-education-primary hover:bg-education-secondary">
                    Login as System Admin
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="parent">
              <form onSubmit={(e) => { e.preventDefault(); navigate('/parent-login'); }}>
                <CardContent className="space-y-4 pt-6">
                  <div className="text-center">
                    <p>Access the parent portal to make payments for your child</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-education-primary hover:bg-education-secondary">
                    Go to Parent Portal
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="text-center mt-4">
          <a href="/register" className="text-sm text-education-accent hover:underline">
            New school? Register here
          </a>
          <div className="mt-2">
            <a href="/parent-register" className="text-sm text-education-accent hover:underline">
              Parent? Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
