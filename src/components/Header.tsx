
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
  const { user, logout } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-education-primary text-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold">AID EDUCATION TECH</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <span>
                  {user.type === 'administrator' 
                    ? `${user.schoolName} Administrator` 
                    : 'System Administrator'}
                </span>
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  className="bg-white text-education-primary hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              className="text-white" 
              onClick={() => setMenuOpen(!menuOpen)}
              size="icon"
            >
              <Menu />
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && user && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              <span className="text-sm">
                {user.type === 'administrator' 
                  ? `${user.schoolName} Administrator` 
                  : 'System Administrator'}
              </span>
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  className="bg-white text-education-primary hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
