
import { RegisterForm } from '@/components/RegisterForm';
import { useAppContext } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';

const RegisterPage = () => {
  const { user } = useAppContext();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <RegisterForm />;
};

export default RegisterPage;
