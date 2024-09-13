import React from 'react';
import RegisterCard from '../components/Auth/RegisterCard';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '../assets/icons/chevron.left.svg';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();

  const navigateToResetPassword = () => {
    navigate('/forgot-password');
  };

  const navigateBack = () => {
    navigate('/');
  };

  return (
    <div>
      <RegisterCard
        header={
          <div>
            Wilkommen bei
            <br /> IntensivKontakt
          </div>
        }
      >
        <div onClick={navigateBack} className="absolute top-[30px] left-[30px] cursor-pointer">
          <LeftArrow />
        </div>
        <div className="px-[40px] ">
          <LoginForm />
        </div>
        <div onClick={navigateToResetPassword} className="cursor-pointer mb-[33px]">
          Passwort vergessen
        </div>
      </RegisterCard>
    </div>
  );
};

export default LoginPage;
