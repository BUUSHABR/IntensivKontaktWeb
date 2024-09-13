import React from 'react';
import AuthLayout from './AuthLayout';
import { ReactComponent as Logo } from '../../assets/icons/authLogo.svg';

type RegisterCardPropsType = {
  children: React.ReactNode;
  header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
};

const RegisterCard = ({ children, header }: RegisterCardPropsType) => {
  return (
    <AuthLayout>
      <div className="bg-int-light-blue rounded-[48px] shadow shadow-authCard w-[406px] text-center relative">
        <div className="flex justify-center mt-[40px] mb-[17px] ">
          <Logo />
        </div>
        <div className="text-h1 text-black text-center leading-[130%] mb-[12px]">{header}</div>
        {children}
      </div>
    </AuthLayout>
  );
};

export default RegisterCard;
