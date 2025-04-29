
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const ParentRegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      // Check if parent with email already exists
      const { data: existingParent, error: checkError } = await supabase
        .from('parents')
        .select('email')
        .eq('email', formData.email)
        .single();
        
      if (existingParent) {
        setErrors({ email: 'Email already registered' });
        return;
      }
      
      // Insert new parent
      const { data, error } = await supabase
        .from('parents')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password, // Note: In production, use proper password hashing
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast.success('Registration successful. Please login.');
      navigate('/parent-login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-education-background">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-education-primary">AID EDUCATION TECH</h1>
          <p className="text-education-muted mt-2">Parent Registration</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Parent Account</CardTitle>
            <CardDescription className="text-center">
              Register to make payments for your child's school fees
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange} 
                  className={errors.name ? 'border-red-500' : ''}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={formData.phone} 
                  onChange={handleChange}
                  className={errors.phone ? 'border-red-500' : ''}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
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
                  placeholder="Create a password"
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-education-primary hover:bg-education-secondary"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Create Account'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/parent-login')}
                className="w-full"
                disabled={isLoading}
              >
                Already have an account? Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
