import { useAuthContext } from 'hoc';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  return null;
}
