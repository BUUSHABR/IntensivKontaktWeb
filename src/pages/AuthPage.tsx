import React from 'react';
import { FButton, FSecondaryButton } from '../styles/form';
import RegisterCard from '../components/Auth/RegisterCard';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hoc';

const AuthPage = () => {
  const navigate = useNavigate();
  let auth = useAuthContext();

  if (auth.isAuthenticated) {
    navigate('/news');
  }

  const locateToRegistration = () => {
    navigate('/register');
  };

  const locateToLogin = () => {
    navigate('/login');
  };

  return (
    <RegisterCard
      header={
        <div>
          Wilkommen bei
          <br /> IntensivKontakt
        </div>
      }
    >
      <div className="mt-[12px] mb-[24px]">
        Jetzt als Angehörige:r registrieren und das <br />
        Wichtigste über Ihre Liebsten erfahren.
      </div>
      <div className="mx-[70px] mb-[6px]" onClick={locateToRegistration}>
        <FButton dark={true}>Registrieren</FButton>
      </div>

      <div className="mx-[70px] mb-[12px]" onClick={locateToLogin}>
        <FSecondaryButton>Anmelden</FSecondaryButton>
      </div>
      <div className="mb-[34px] text-small">🔒 Europäische Datensicherheit</div>
    </RegisterCard>
  );
};

export default AuthPage;
