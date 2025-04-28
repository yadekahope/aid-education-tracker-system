
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';

export const AddStudentForm = () => {
  const { classes, addStudent } = useAppContext();
  
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [fee, setFee] = useState<number>(0);

  useEffect(() => {
    if (selectedClass) {
      const classData = classes.find((c) => c.name === selectedClass);
      if (classData) {
        setFee(classData.fee);
      }
    } else {
      setFee(0);
    }
  }, [selectedClass, classes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !selectedClass) return;
    
    addStudent({
      name,
      class: selectedClass,
      totalFee: fee,
      amountPaid: 0,
    });
    
    // Reset form
    setName('');
    setSelectedClass('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Student</CardTitle>
        <CardDescription>Enter student details to register</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Enter student name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass} required>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.name} value={classItem.name}>
                    {classItem.name} - Fee: ${classItem.fee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fee">Total Fee</Label>
            <Input 
              id="fee" 
              type="number" 
              value={fee} 
              disabled 
              className="bg-gray-50"
            />
            <p className="text-xs text-muted-foreground">Fee is automatically set based on class</p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full bg-education-primary hover:bg-education-secondary">
            Add Student
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
