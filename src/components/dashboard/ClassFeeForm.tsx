
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';

export const ClassFeeForm = () => {
  const { classes, addClass } = useAppContext();
  
  const [className, setClassName] = useState('');
  const [fee, setFee] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!className || fee <= 0) return;
    
    addClass({
      name: className,
      fee,
    });
    
    // Reset form
    setClassName('');
    setFee(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Class Fees</CardTitle>
        <CardDescription>Add or update class fee structures</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="className">Class Name</Label>
            <Input 
              id="className" 
              value={className} 
              onChange={(e) => setClassName(e.target.value)} 
              required 
              placeholder="e.g. Class 6"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fee">Fee Amount</Label>
            <Input 
              id="fee" 
              type="number" 
              min={1}
              value={fee || ''} 
              onChange={(e) => setFee(Number(e.target.value))} 
              required 
              placeholder="Enter fee amount"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full bg-education-primary hover:bg-education-secondary">
            Save Class Fee
          </Button>
        </CardFooter>
      </form>
      
      <div className="p-6 pt-0">
        <h3 className="font-medium mb-3">Current Class Fees</h3>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2 text-left font-semibold text-sm">Class</th>
                <th className="p-2 text-right font-semibold text-sm">Fee Amount</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem) => (
                <tr key={classItem.name} className="border-b">
                  <td className="p-2">{classItem.name}</td>
                  <td className="p-2 text-right">${classItem.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
