
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';

export const PaymentForm = () => {
  const { students, recordPayment } = useAppContext();
  
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [studentDetails, setStudentDetails] = useState<{
    name: string;
    class: string;
    totalFee: number;
    amountPaid: number;
    balance: number;
  } | null>(null);

  const findStudent = () => {
    if (!studentId) {
      setStudentDetails(null);
      return;
    }
    
    const student = students.find((s) => s.id === studentId);
    
    if (student) {
      setStudentDetails({
        name: student.name,
        class: student.class,
        totalFee: student.totalFee,
        amountPaid: student.amountPaid,
        balance: student.totalFee - student.amountPaid,
      });
    } else {
      toast.error('Student not found');
      setStudentDetails(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId || amount <= 0) {
      toast.error('Please enter valid payment details');
      return;
    }
    
    if (!studentDetails) {
      toast.error('Student not found');
      return;
    }
    
    if (amount > studentDetails.balance) {
      toast.error('Payment amount exceeds balance');
      return;
    }
    
    recordPayment({
      studentId,
      amount,
    });
    
    // Reset form
    setStudentId('');
    setAmount(0);
    setStudentDetails(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
        <CardDescription>Record a student fee payment</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID</Label>
          <div className="flex space-x-2">
            <Input 
              id="studentId" 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)} 
              placeholder="e.g. STD001"
            />
            <Button 
              type="button" 
              onClick={findStudent}
              className="bg-education-primary hover:bg-education-secondary"
            >
              Find
            </Button>
          </div>
        </div>
        
        {studentDetails && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-md">
            <div>
              <p className="text-sm font-medium">Student Name</p>
              <p className="text-lg">{studentDetails.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Class</p>
                <p>{studentDetails.class}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Total Fee</p>
                <p>${studentDetails.totalFee}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Amount Paid</p>
                <p>${studentDetails.amountPaid}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Balance</p>
                <p className="font-semibold">${studentDetails.balance}</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  min={1} 
                  max={studentDetails.balance}
                  value={amount || ''} 
                  onChange={(e) => setAmount(Number(e.target.value))} 
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-4 bg-education-primary hover:bg-education-secondary"
                disabled={amount <= 0 || amount > studentDetails.balance}
              >
                Record Payment
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
