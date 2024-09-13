import React, { useEffect, useState } from 'react';
import { ReactComponent as Logo } from '../assets/icons/authLogo.svg';
import { ReactComponent as SuccessIcon } from '../assets/icons/BigSuccessIcon.svg';
import AuthLayout from '../components/Auth/AuthLayout';
import { FButton } from '../styles/form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Preloader from '../components/Preloader';
import http from '../components/util/http';

const EmailConfirmedSuccessPage = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState<boolean>();
  const [activationParams, setActivationParams] = useSearchParams();
  const { token } = useParams();

  function emailChangeOrActivation(endpoint: string, values: {}) {
    http
      .post(endpoint, values)
      .then((res) => {
        setIsSuccess(true);
      })
      .catch((err) => {
        setIsSuccess(false);
      });
  }

  useEffect(() => {
    if (token && activationParams.get("account_activation")) {
      emailChangeOrActivation(`/auth/users/activate_account/${token}/`, {});
    }
    else if (token && activationParams.get("email_change")) {
      emailChangeOrActivation('/auth/users/email-confirm/', {token});
    }
  }, [token]);

  if (isSuccess === undefined) {
    return (
      <AuthLayout>
        <div className="bg-int-light-blue rounded-[48px] shadow shadow-authCard w-[406px] text-center relative h-[300px]">
          <div className="flex justify-center mt-[40px] mb-[17px] ">
            <Logo />
          </div>
          <Preloader />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="bg-int-light-blue rounded-[48px] shadow shadow-authCard w-[406px] text-center relative">
        <div className="flex justify-center mt-[40px] mb-[17px] ">
          <Logo />
        </div>
        {isSuccess ? (
          <>
            <div className="mt-[70px] flex justify-center">
              <SuccessIcon />
            </div>
            <div className="text-h1 text-black mt-[18px]">
              E-Mail-Adresse
              <br />
              bestätigt
            </div>
            <div
              className="mt-[76px] cursor-pointer mb-[80px] w-[330px] m-auto"
              onClick={() => navigate('/login')}
            >
              <FButton dark={true}>Weiter</FButton>
            </div>
          </>
        ) : (
          <div className="text-h1 text-black mt-[58px] mb-[100px]">
            Etwas ist schief <br /> gelaufen...
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default EmailConfirmedSuccessPage;
