import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, Payment, ClassFee, School, User } from '@/types';
import { toast } from 'sonner';

// Sample initial data
const initialClasses: ClassFee[] = [
  { name: 'Class 1', fee: 1000 },
  { name: 'Class 2', fee: 1200 },
  { name: 'Class 3', fee: 1500 },
  { name: 'Class 4', fee: 1800 },
  { name: 'Class 5', fee: 2000 },
];

const initialStudents: Student[] = [
  { id: 'STD001', name: 'John Doe', class: 'Class 1', totalFee: 1000, amountPaid: 500 },
  { id: 'STD002', name: 'Jane Smith', class: 'Class 2', totalFee: 1200, amountPaid: 600 },
  { id: 'STD003', name: 'Michael Johnson', class: 'Class 3', totalFee: 1500, amountPaid: 1500 },
  { id: 'STD004', name: 'Sarah Williams', class: 'Class 4', totalFee: 1800, amountPaid: 900 },
  { id: 'STD005', name: 'David Brown', class: 'Class 5', totalFee: 2000, amountPaid: 0 },
];

const initialPayments: Payment[] = [
  { id: 'PAY001', studentId: 'STD001', amount: 500, date: '2025-03-15' },
  { id: 'PAY002', studentId: 'STD002', amount: 600, date: '2025-03-18' },
  { id: 'PAY003', studentId: 'STD003', amount: 1500, date: '2025-03-20' },
  { id: 'PAY004', studentId: 'STD004', amount: 900, date: '2025-03-22' },
];

const initialSchools: School[] = [
  {
    name: 'Demo School',
    address: '123 Education St',
    email: 'demo@school.edu',
    phone: '123-456-7890',
    password: 'password123',
    activationCode: 'DEMO123',
  }
];

// Valid activation codes that can be used for new schools
const validActivationCodes: string[] = ['SCHOOL001', 'SCHOOL002', 'SCHOOL003'];

interface ActivationCode {
  code: string;
  used: boolean;
}

interface AppContextType {
  students: Student[];
  payments: Payment[];
  classes: ClassFee[];
  schools: School[];
  user: User | null;
  isLoading: boolean;
  splashComplete: boolean;
  generateActivationCode: () => string;
  addStudent: (student: Omit<Student, 'id'>) => void;
  recordPayment: (payment: Omit<Payment, 'id' | 'date'>) => void;
  getUnpaidStudents: (classFilter?: string, idFilter?: string) => Student[];
  addClass: (classData: ClassFee) => void;
  registerSchool: (school: Omit<School, 'activationCode'>, activationCode: string) => boolean;
  login: (schoolName: string, password: string) => boolean;
  adminLogin: (password: string) => boolean;
  logout: () => void;
  setSplashComplete: (value: boolean) => void;
  generatedCodes: ActivationCode[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [classes, setClasses] = useState<ClassFee[]>(initialClasses);
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<ActivationCode[]>([]);

  // Generate a new activation code for a school
  const generateActivationCode = (): string => {
    const code = `SCHOOL${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedCodes(prev => [...prev, { code, used: false }]);
    toast.success(`Generated activation code: ${code}`);
    return code;
  };

  // Add a new student
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    try {
      setIsLoading(true);
      const newId = `STD${String(students.length + 1).padStart(3, '0')}`;
      const newStudent: Student = {
        id: newId,
        ...studentData,
      };
      setStudents((prev) => [...prev, newStudent]);
      toast.success(`Student ${newStudent.name} added successfully`);
    } catch (error) {
      toast.error('Failed to add student');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Record a payment
  const recordPayment = (paymentData: Omit<Payment, 'id' | 'date'>) => {
    try {
      setIsLoading(true);
      const student = students.find((s) => s.id === paymentData.studentId);
      
      if (!student) {
        toast.error('Student not found');
        return;
      }

      const newId = `PAY${String(payments.length + 1).padStart(3, '0')}`;
      const newPayment: Payment = {
        id: newId,
        ...paymentData,
        date: new Date().toISOString().split('T')[0],
      };

      setPayments((prev) => [...prev, newPayment]);

      // Update the student's amount paid
      setStudents((prev) =>
        prev.map((s) =>
          s.id === paymentData.studentId
            ? { ...s, amountPaid: s.amountPaid + paymentData.amount }
            : s
        )
      );

      toast.success(`Payment of ${paymentData.amount} recorded successfully`);
    } catch (error) {
      toast.error('Failed to record payment');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unpaid students with optional filters
  const getUnpaidStudents = (classFilter?: string, idFilter?: string) => {
    let filteredStudents = students.filter((student) => student.amountPaid < student.totalFee);

    if (classFilter) {
      filteredStudents = filteredStudents.filter((student) => student.class === classFilter);
    }

    if (idFilter) {
      filteredStudents = filteredStudents.filter((student) => student.id === idFilter);
    }

    return filteredStudents;
  };

  // Add a new class with fee
  const addClass = (classData: ClassFee) => {
    try {
      setIsLoading(true);
      
      // Check if class already exists
      if (classes.some((c) => c.name === classData.name)) {
        // Update existing class
        setClasses((prev) =>
          prev.map((c) => (c.name === classData.name ? { ...c, fee: classData.fee } : c))
        );
        toast.success(`Class ${classData.name} updated successfully`);
      } else {
        // Add new class
        setClasses((prev) => [...prev, classData]);
        toast.success(`Class ${classData.name} added successfully`);
      }
    } catch (error) {
      toast.error('Failed to add class');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register a new school with validation for activation code
  const registerSchool = (
    schoolData: Omit<School, 'activationCode'>,
    activationCode: string
  ): boolean => {
    // Check if school name already exists
    if (schools.some((s) => s.name === schoolData.name)) {
      toast.error('School name already registered');
      return false;
    }

    // Find the activation code
    const codeIndex = generatedCodes.findIndex(c => c.code === activationCode);
    if (codeIndex === -1 || generatedCodes[codeIndex].used) {
      toast.error('Invalid or already used activation code');
      return false;
    }

    try {
      setIsLoading(true);
      const newSchool: School = {
        ...schoolData,
        activationCode,
      };
      
      // Mark the code as used
      setGeneratedCodes(prev => prev.map((code, index) => 
        index === codeIndex ? { ...code, used: true } : code
      ));
      
      setSchools((prev) => [...prev, newSchool]);
      toast.success(`School ${newSchool.name} registered successfully`);
      return true;
    } catch (error) {
      toast.error('Failed to register school');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login as administrator (school)
  const login = (schoolName: string, password: string): boolean => {
    const school = schools.find(
      (s) => s.name === schoolName && s.password === password
    );

    if (school) {
      setUser({ type: 'administrator', schoolName: school.name });
      toast.success(`Welcome, ${school.name} Administrator`);
      return true;
    } else {
      toast.error('Invalid school name or password');
      return false;
    }
  };

  // Login as admin (system)
  const adminLogin = (password: string): boolean => {
    // For demo purposes, use a simple admin password
    if (password === 'aideducation123') {
      setUser({ type: 'admin' });
      toast.success('Welcome, System Administrator');
      return true;
    } else {
      toast.error('Invalid admin password');
      return false;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    students,
    payments,
    classes,
    schools,
    user,
    isLoading,
    splashComplete,
    generateActivationCode,
    addStudent,
    recordPayment,
    getUnpaidStudents,
    addClass,
    registerSchool,
    login,
    adminLogin,
    logout,
    setSplashComplete,
    generatedCodes,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
