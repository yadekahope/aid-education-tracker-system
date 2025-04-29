
export interface Student {
  id: string;
  name: string;
  class: string;
  totalFee: number;
  amountPaid: number;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
}

export interface ClassFee {
  name: string;
  fee: number;
}

export interface School {
  name: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  activationCode: string;
  paystackPublicKey?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  type: 'admin' | 'administrator' | 'parent';
  schoolName?: string;
  parentId?: string;
}
