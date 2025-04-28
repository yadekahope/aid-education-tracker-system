
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export const SplashScreen = () => {
  const { setSplashComplete } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [setSplashComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-education-primary animate-fade-in">
      <div className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider">
        AID EDUCATION TECH
      </div>
      <div className="mt-8">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
