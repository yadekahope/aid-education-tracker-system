
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppContext } from '@/context/AppContext';
import { Student } from '@/types';

export const UnpaidStudentsTable = () => {
  const { classes, getUnpaidStudents } = useAppContext();
  
  const [classFilter, setClassFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [unpaidStudents, setUnpaidStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Initial load of unpaid students
    setUnpaidStudents(getUnpaidStudents());
  }, [getUnpaidStudents]);

  const handleFilter = () => {
    setUnpaidStudents(getUnpaidStudents(classFilter, idFilter));
  };

  const handleClearFilters = () => {
    setClassFilter('');
    setIdFilter('');
    setUnpaidStudents(getUnpaidStudents());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unpaid Students</CardTitle>
        <CardDescription>View and filter students with outstanding fees</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Classes</SelectItem>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.name} value={classItem.name}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Input
              placeholder="Filter by student ID"
              value={idFilter}
              onChange={(e) => setIdFilter(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleFilter}
              className="bg-education-primary hover:bg-education-secondary"
            >
              Filter
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Total Fee</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unpaidStudents.length > 0 ? (
                unpaidStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>${student.totalFee}</TableCell>
                    <TableCell>${student.amountPaid}</TableCell>
                    <TableCell className="font-medium">
                      ${student.totalFee - student.amountPaid}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No unpaid students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
