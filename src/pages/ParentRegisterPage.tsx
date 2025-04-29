
import { ParentRegisterForm } from '@/components/ParentRegisterForm';
import { useAppContext } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';

const ParentRegisterPage = () => {
  const { user } = useAppContext();

  if (user) {
    if (user.type === 'parent') {
      return <Navigate to="/parent-dashboard" />;
    } else if (user.type === 'administrator') {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/admin" />;
    }
  }

  return <ParentRegisterForm />;
};

export default ParentRegisterPage;
