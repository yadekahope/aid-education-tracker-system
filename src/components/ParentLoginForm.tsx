
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';

export const ParentLoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setErrors({
        ...(formData.email ? {} : { email: 'Email is required' }),
        ...(formData.password ? {} : { password: 'Password is required' }),
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Login parent
      const { data, error } = await supabase
        .from('parents')
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password) // Note: In production, use proper password verification
        .single();
        
      if (error || !data) {
        setErrors({ email: 'Invalid email or password' });
        return;
      }
      
      // Set user in context
      setUser({ 
        type: 'parent', 
        parentId: data.id 
      });
      
      toast.success(`Welcome, ${data.name}`);
      navigate('/parent-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-education-background">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-education-primary">AID EDUCATION TECH</h1>
          <p className="text-education-muted mt-2">Parent Login</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Parent Login</CardTitle>
            <CardDescription className="text-center">
              Login to make payments for your child's school fees
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={formData.email} 
                  onChange={handleChange}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password"
                  value={formData.password} 
                  onChange={handleChange}
                  className={errors.password ? 'border-red-500' : ''}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-education-primary hover:bg-education-secondary"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/parent-register')}
                className="w-full"
                disabled={isLoading}
              >
                Don't have an account? Register
              </Button>
              <Button 
                type="button" 
                variant="link" 
                onClick={() => navigate('/login')}
                className="w-full"
                disabled={isLoading}
              >
                Go back to main login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
