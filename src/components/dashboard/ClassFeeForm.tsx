
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppContext } from '@/context/AppContext';
import { Edit } from 'lucide-react';

export const ClassFeeForm = () => {
  const { classes, addClass, updateClass } = useAppContext();
  
  const [className, setClassName] = useState('');
  const [fee, setFee] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClass, setEditingClass] = useState<{ originalName: string; name: string; fee: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleEdit = (classItem: { name: string; fee: number }) => {
    setEditingClass({ 
      originalName: classItem.name,
      name: classItem.name, 
      fee: classItem.fee 
    });
    setDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingClass || !editingClass.name || editingClass.fee <= 0) return;
    
    await updateClass(
      editingClass.originalName,
      editingClass.name,
      editingClass.fee
    );
    
    // Reset and close dialog
    setEditingClass(null);
    setDialogOpen(false);
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Manage Class Fees</CardTitle>
        <CardDescription className="dark:text-gray-300">Add or update class fee structures</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="className" className="dark:text-gray-300">Class Name</Label>
            <Input 
              id="className" 
              value={className} 
              onChange={(e) => setClassName(e.target.value)} 
              required 
              placeholder="e.g. Class 6"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fee" className="dark:text-gray-300">Fee Amount</Label>
            <Input 
              id="fee" 
              type="number" 
              min={1}
              value={fee || ''} 
              onChange={(e) => setFee(Number(e.target.value))} 
              required 
              placeholder="Enter fee amount"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full bg-education-primary hover:bg-education-secondary dark:bg-blue-600 dark:hover:bg-blue-700">
            Save Class Fee
          </Button>
        </CardFooter>
      </form>
      
      <div className="p-6 pt-0">
        <h3 className="font-medium mb-3 dark:text-white">Current Class Fees</h3>
        <div className="rounded-md border dark:border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <th className="p-2 text-left font-semibold text-sm dark:text-gray-300">Class</th>
                <th className="p-2 text-right font-semibold text-sm dark:text-gray-300">Fee Amount</th>
                <th className="p-2 text-right font-semibold text-sm dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem) => (
                <tr key={classItem.name} className="border-b dark:border-gray-700">
                  <td className="p-2 dark:text-gray-300">{classItem.name}</td>
                  <td className="p-2 text-right dark:text-gray-300">${classItem.fee}</td>
                  <td className="p-2 text-right">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleEdit(classItem)}
                      className="h-8 w-8 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Class</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="editClassName" className="dark:text-gray-300">Class Name</Label>
              <Input 
                id="editClassName" 
                value={editingClass?.name || ''} 
                onChange={(e) => setEditingClass(prev => prev ? {...prev, name: e.target.value} : null)} 
                required 
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editFee" className="dark:text-gray-300">Fee Amount</Label>
              <Input 
                id="editFee" 
                type="number" 
                min={1}
                value={editingClass?.fee || ''}
                onChange={(e) => setEditingClass(prev => prev ? {...prev, fee: Number(e.target.value)} : null)}
                required 
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-education-primary hover:bg-education-secondary dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Update Class
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
