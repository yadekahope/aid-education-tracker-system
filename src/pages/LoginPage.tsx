
import { LoginForm } from '@/components/LoginForm';
import { useAppContext } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { user } = useAppContext();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <LoginForm />;
};

export default LoginPage;
