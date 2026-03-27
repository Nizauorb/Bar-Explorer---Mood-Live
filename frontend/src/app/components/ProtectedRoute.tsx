import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { user } = useApp();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Attendre un peu que le contexte se charge
      setTimeout(() => {
        setIsChecking(false);
      }, 50);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isChecking && !user) {
      navigate('/');
    }
  }, [user, navigate, isChecking]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#E8EBF5] flex items-center justify-center">
        <div className="text-[#717182]" style={{ fontSize: '16px' }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Sera redirigé par le useEffect
  }

  return <>{children}</>;
}
