
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAppContext } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  requireAuth = true,
  adminOnly = false 
}) => {
  const { user } = useAppContext();

  if (requireAuth && !user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.type !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-education-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};
