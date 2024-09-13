import React, { useEffect, useState } from 'react';
import RegisterCard from '../components/Auth/RegisterCard';
import { ReactComponent as LeftArrow } from '../assets/icons/chevron.left.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { FSecondaryButton } from '../styles/form';
import http from '../components/util/http';
import ToastConsumer from 'hoc/toastProvider';

const LoginWithUnconfirmedEmailPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { toast } = ToastConsumer();

  const [isNewResendActive, setIsNewResendActive] = useState(true);

  const navigateToLogin = () => {
    navigate('/login');
  };

  const resendActivationLink = () => {
    http
      .put(`/auth/users/resend_activation_link/`, { email: params.email })
      .then((res) => {
        const currentDate = new Date();
        const finishDate = currentDate.setMinutes(currentDate.getMinutes() + 5);
        localStorage.setItem('blotButtonDate', JSON.stringify(finishDate));
        setIsNewResendActive(false);
      })
      .catch((err) => {
        toast.error('Etwas ist schief gelaufen');
      });
  };

  const finishDateMSeconds = JSON.parse(localStorage.getItem('blotButtonDate') || '0');

  useEffect(() => {
    const checkIsResendReady = () => {
      const currentDateMSeconds = Date.parse(new Date().toISOString());
      if (finishDateMSeconds < currentDateMSeconds) {
        setIsNewResendActive(true);
      } else {
        setIsNewResendActive(false);
      }
    };

    checkIsResendReady();

    const interval = setInterval(() => {
      checkIsResendReady();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [finishDateMSeconds]);

  return (
    <div>
      <RegisterCard
        header={<div className="text-int-dark-blue text-h1 text-center">Wilkommen</div>}
      >
        <div onClick={navigateToLogin} className="absolute top-[30px] left-[30px] cursor-pointer">
          <LeftArrow />
        </div>
        <div className="my-[40px] px-[40px] text-body-small text-center text-black">
          <div className="text-[#FF3B30] mb-[20px]">
            Die Bestätigung Ihrer
            <br /> E-Mail-Adresse steht noch aus.
          </div>
          <div className="mb-[20px]">
            Bitte prüfen Sie Ihr E-Mail Postfach
            <br /> und Ihren Spam-Ordner.
          </div>
          <div>
            Falls Sie keine E-Mail erhalten haben,
            <br /> klicken Sie hier, um die E-Mail erneut
            <br />
            zugeschickt zu bekommen.
          </div>
          <div className="mt-[50px]" onClick={resendActivationLink}>
            <FSecondaryButton disabled={!isNewResendActive}>E-Mail ERNEUT senden</FSecondaryButton>
          </div>
          <div className="text-[#FF3B30] text-body-small pt-[10px] h-[55px]">
            {!isNewResendActive && (
              <div>
                Erneuter Versand ist erst wieder <br />
                nach 5min verfügbar.
              </div>
            )}
          </div>
        </div>
      </RegisterCard>
    </div>
  );
};

export default LoginWithUnconfirmedEmailPage;
