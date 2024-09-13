import React from 'react';
import RegisterCard from '../components/Auth/RegisterCard';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <div>
      <RegisterCard
        header={
          <div>
            Legen Sie Ihr
            <br />
            neues Passwort fest
          </div>
        }
      >
        <div className="my-[70px] px-[40px]">
          <ResetPasswordForm />
        </div>
      </RegisterCard>
    </div>
  );
};

export default ResetPasswordPage;
