
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Student, Payment, ClassFee, School, User } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';

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
  theme: string;
  toggleTheme: () => void;
  setUser: (user: User | null) => void;
  generateActivationCode: () => Promise<string>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  recordPayment: (payment: Omit<Payment, 'id' | 'date'>) => Promise<void>;
  getUnpaidStudents: (classFilter?: string, idFilter?: string) => Student[];
  addClass: (classData: ClassFee) => Promise<void>;
  updateClass: (oldName: string, newName: string, fee: number) => Promise<void>;
  registerSchool: (school: Omit<School, 'activationCode'>, activationCode: string) => Promise<boolean>;
  login: (schoolName: string, password: string) => Promise<boolean>;
  adminLogin: (password: string) => Promise<boolean>;
  logout: () => void;
  setSplashComplete: (value: boolean) => void;
  generatedCodes: ActivationCode[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [classes, setClasses] = useState<ClassFee[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<ActivationCode[]>([]);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('schools')
          .select('*');
          
        if (schoolsError) throw schoolsError;
        if (schoolsData) setSchools(schoolsData);
        
        const { data: codesData, error: codesError } = await supabase
          .from('activation_codes')
          .select('*');
          
        if (codesError) throw codesError;
        if (codesData) setGeneratedCodes(codesData.map(code => ({ code: code.code, used: code.used })));

        if (user && user.type === 'administrator') {
          const { data: classesData, error: classesError } = await supabase
            .from('class_fees')
            .select('*')
            .eq('school_name', user.schoolName);
            
          if (classesError) throw classesError;
          if (classesData) setClasses(classesData.map(c => ({ name: c.name, fee: c.fee })));
          
          const { data: studentsData, error: studentsError } = await supabase
            .from('students')
            .select('*')
            .eq('school_name', user.schoolName);
            
          if (studentsError) throw studentsError;
          if (studentsData) setStudents(studentsData);
          
          const { data: paymentsData, error: paymentsError } = await supabase
            .from('payments')
            .select('*')
            .eq('school_name', user.schoolName);
            
          if (paymentsError) throw paymentsError;
          if (paymentsData) setPayments(paymentsData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const generateActivationCode = async (): Promise<string> => {
    try {
      const code = `SCHOOL${Math.floor(1000 + Math.random() * 9000)}`;
      
      const { error } = await supabase
        .from('activation_codes')
        .insert([{ code, used: false }]);
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setGeneratedCodes(prev => [...prev, { code, used: false }]);
      
      toast.success(`Generated activation code: ${code}`);
      return code;
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error('Failed to generate activation code');
      return '';
    }
  };

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    if (!user || user.type !== 'administrator') {
      toast.error('Unauthorized access');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const newId = `STD${String(students.length + 1).padStart(3, '0')}`;
      const newStudent: Student = {
        id: newId,
        ...studentData
      };
      
      const studentWithSchool = { ...newStudent, school_name: user.schoolName };
      
      const { error } = await supabase
        .from('students')
        .insert([studentWithSchool]);
        
      if (error) throw error;
      
      setStudents((prev) => [...prev, newStudent]);
      toast.success(`Student ${newStudent.name} added successfully`);
    } catch (error) {
      toast.error('Failed to add student');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const recordPayment = async (paymentData: Omit<Payment, 'id' | 'date'>) => {
    if (!user || user.type !== 'administrator') {
      toast.error('Unauthorized access');
      return;
    }
    
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
      
      const paymentWithSchool = { ...newPayment, school_name: user.schoolName };
      
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([paymentWithSchool]);
        
      if (paymentError) throw paymentError;

      const { error: studentError } = await supabase
        .from('students')
        .update({ amountPaid: student.amountPaid + paymentData.amount })
        .eq('id', student.id)
        .eq('school_name', user.schoolName);
        
      if (studentError) throw studentError;
      
      setPayments((prev) => [...prev, newPayment]);
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

  const addClass = async (classData: ClassFee) => {
    if (!user || user.type !== 'administrator') {
      toast.error('Unauthorized access');
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (classes.some((c) => c.name === classData.name)) {
        return updateClass(classData.name, classData.name, classData.fee);
      }
      
      const classWithSchool = { ...classData, school_name: user.schoolName };
      
      const { error } = await supabase
        .from('class_fees')
        .insert([classWithSchool]);
        
      if (error) throw error;
      
      setClasses((prev) => [...prev, classData]);
      toast.success(`Class ${classData.name} added successfully`);
    } catch (error) {
      toast.error('Failed to add class');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateClass = async (oldName: string, newName: string, fee: number) => {
    if (!user || user.type !== 'administrator') {
      toast.error('Unauthorized access');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('class_fees')
        .update({ name: newName, fee })
        .eq('name', oldName)
        .eq('school_name', user.schoolName);
        
      if (error) throw error;
      
      setClasses((prev) =>
        prev.map((c) => (c.name === oldName ? { name: newName, fee } : c))
      );
      
      if (oldName !== newName) {
        const { error: studentError } = await supabase
          .from('students')
          .update({ class: newName })
          .eq('class', oldName)
          .eq('school_name', user.schoolName);
          
        if (studentError) throw studentError;
        
        setStudents((prev) =>
          prev.map((s) => (s.class === oldName ? { ...s, class: newName } : s))
        );
      }
      
      toast.success(`Class ${oldName} updated successfully`);
    } catch (error) {
      toast.error('Failed to update class');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerSchool = async (
    schoolData: Omit<School, 'activationCode'>,
    activationCode: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data: existingSchool, error: checkError } = await supabase
        .from('schools')
        .select('name')
        .eq('name', schoolData.name)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      if (existingSchool) {
        toast.error('School name already registered');
        return false;
      }
      
      const { data: codeData, error: codeError } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code', activationCode)
        .single();
        
      if (codeError) {
        toast.error('Invalid activation code');
        return false;
      }
      
      if (codeData.used) {
        toast.error('Activation code already used');
        return false;
      }
      
      const newSchool: School = {
        ...schoolData,
        activationCode,
      };
      
      const { error: insertError } = await supabase
        .from('schools')
        .insert([newSchool]);
        
      if (insertError) throw insertError;
      
      const { error: updateError } = await supabase
        .from('activation_codes')
        .update({ used: true })
        .eq('code', activationCode);
        
      if (updateError) throw updateError;
      
      setSchools((prev) => [...prev, newSchool]);
      setGeneratedCodes((prev) => 
        prev.map((code) => 
          code.code === activationCode ? { ...code, used: true } : code
        )
      );
      
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

  const login = async (schoolName: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('name', schoolName)
        .eq('password', password)
        .single();
        
      if (error || !data) {
        toast.error('Invalid school name or password');
        return false;
      }
      
      setUser({ type: 'administrator', schoolName: data.name });
      toast.success(`Welcome, ${data.name} Administrator`);
      return true;
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (password === 'aideducation123') {
        setUser({ type: 'admin' });
        toast.success('Welcome, System Administrator');
        return true;
      } else {
        toast.error('Invalid admin password');
        return false;
      }
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setClasses([]);
    setStudents([]);
    setPayments([]);
    toast.success('Logged out successfully');
  };

  const value = {
    students,
    payments,
    classes,
    schools,
    user,
    setUser,
    isLoading,
    splashComplete,
    theme,
    toggleTheme,
    generateActivationCode,
    addStudent,
    recordPayment,
    getUnpaidStudents,
    addClass,
    updateClass,
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
