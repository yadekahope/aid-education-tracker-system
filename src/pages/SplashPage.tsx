
import { SplashScreen } from '@/components/SplashScreen';
import { LoginForm } from '@/components/LoginForm';
import { useAppContext } from '@/context/AppContext';

const SplashPage = () => {
  const { splashComplete } = useAppContext();

  return (
    <>
      {!splashComplete ? (
        <SplashScreen />
      ) : (
        <LoginForm />
      )}
    </>
  );
};

export default SplashPage;
