import React, { useState } from 'react';
import AuthLayout from '../components/Auth/AuthLayout';
import { ReactComponent as Logo } from '../assets/icons/authLogo.svg';
import { ReactComponent as PhoneSuccess } from '../assets/icons/PhoneSuccess.svg';
import { FButton } from '../styles/form';
import { useNavigate } from 'react-router-dom';
import http from 'components/util/http';
import PinInput from 'react-pin-input';
import ToastConsumer from '../hoc/toastProvider';

const PhoneConfirmPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const { toast } = ToastConsumer();

  const confirmCode = (code: string) => {
    http
      .post(`/auth/users/phone-confirm/`, { confirmation_code: code })
      .then((res) => {
        setIsSuccess(true);
      })
      .catch((err) => {
        setIsError(true);
        toast.error('Ihr Code ist nicht korrekt oder existiert nicht');
      });
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="bg-int-light-blue rounded-[48px] shadow shadow-authCard w-[406px] text-center relative">
          <div className="flex justify-center mt-[40px] mb-[17px] ">
            <Logo />
          </div>
          <div className="mt-[70px] flex justify-center">
            <PhoneSuccess />
          </div>
          <div className="text-h1 text-black mt-[18px]">
            IntensivKontakt <br /> herunterladen
          </div>
          <div className="text-small font-bold text-int-grey-90 mt-[12px]">
            Es ist fast geschafft. Laden Sie sich die
            <br /> IntensivKontakt App auf Ihr Smartphone.
          </div>
          <div
            className="mt-[50px] cursor-pointer mb-[80px] w-[330px] m-auto"
            onClick={() => navigate('/news')}
          >
            <FButton dark={true}>Weiter</FButton>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="bg-int-light-blue rounded-[48px] shadow shadow-authCard w-[406px] text-center relative pb-[40px]">
        <div className="flex justify-center mt-[40px] mb-[17px] ">
          <Logo />
        </div>
        <div className="text-center text-[14x]">
          Bitte bestätigen Sie Ihre Angaben mit dem Aktivierungs-Code den wir Ihnen per SMS
          zugesendet haben
        </div>
        <div className="text-center text-[#56A0BB] text-[18px] font-bold mt-[20px] mb-[10px]">
          Code eingeben
        </div>

        {/*@ts-ignore*/}
        <PinInput
          length={5}
          focus
          type="numeric"
          inputMode="number"
          style={{ padding: '10px' }}
          onChange={(value, index) => {
            setIsError(false);
          }}
          inputStyle={{
            borderColor: isError ? '#DC2626' : '#D3E4E8',
            color: isError ? '#DC2626' : '',
            height: '60px',
            width: '50px',
            borderRadius: '8px',
            fontSize: '52px',
            lineHeight: '96.2px',
            background: '#FAFAFA',
          }}
          inputFocusStyle={{ borderColor: isError ? '#DC2626' : '#56A0BB' }}
          onComplete={(value) => {
            confirmCode(value);
          }}
          autoSelect={true}
          placeholder="0"
        />
      </div>
    </AuthLayout>
  );
};

export default PhoneConfirmPage;
