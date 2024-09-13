import React, { useEffect, useState } from 'react';
import PinInput from 'react-pin-input';
import { ReactComponent as SuccessIcon } from '../../../assets/icons/BigSuccessIcon.svg';
import http from '../../util/http';
import ToastConsumer from '../../../hoc/toastProvider';

type PinCodeModalContentProps = {
  closePinCode: () => void;
  openModalEmail: () => void;
  isEmailChanged: boolean;
};

const PinCodeModalContent = ({
  closePinCode,
  openModalEmail,
  isEmailChanged,
}: PinCodeModalContentProps) => {
  const { toast } = ToastConsumer();
  const [isError, setIsError] = useState(false);
  const [ele, setEle] = useState<PinInput | null>(null);

  const [isSuccessInfo, setIsSuccessInfo] = useState<boolean>(false);

  useEffect(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>('.pincode-input-text');
    if (inputs && inputs.length) {
      for (let i = 0; i < inputs.length; ++i) {
        inputs[i].placeholder = '0';
      }
    }
  }, []);

  const openModalEmailIfEmailChanged = () => {
    if (isEmailChanged) {
      openModalEmail();
    }
  };

  const closeModalPinTimeout = () => {
    setTimeout(() => {
      closePinCode();
      openModalEmailIfEmailChanged();
    }, 2000);
  };

  const sendPinValue = (pin: string) => {
    http
      .post('/auth/users/phone-confirm/', { confirmation_code: pin })
      .then(() => {
        toast.success('Erfolgreich');
        setIsSuccessInfo(true);
        closeModalPinTimeout();
      })
      .catch(() => {
        setIsError(true);
        if (ele) ele.clear();
      });
  };

  return (
    <>
      {!isSuccessInfo ? (
        <div className="flex flex-col items-center">
          <div className="text-center text-[14x]">
            Bitte bestätigen Sie Ihre Angaben mit dem Aktivierungs-Code den wir Ihnen per SMS
            zugesendet haben
          </div>
          <div className="text-center text-[#56A0BB] text-[18px] font-bold mt-[20px] mb-[10px]">
            Code eingeben
          </div>
          {isError && <p className=" text-int-red">Ungültiger code!</p>}

          {/*@ts-ignore*/}
          <PinInput
            ref={(n) => setEle(n)}
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
              height: '100px',
              width: '80px',
              borderRadius: '8px',
              fontSize: '72px',
              lineHeight: '96.2px',
              background: '#FAFAFA',
            }}
            inputFocusStyle={{ borderColor: isError ? '#DC2626' : '#56A0BB' }}
            onComplete={(value) => {
              sendPinValue(value);
            }}
            autoSelect={true}
            placeholder="0"
          />

          <div
            className="text-center mt-[20px] mb-[10px] text-[#6D9CB7] cursor-pointer"
            onClick={() => {
              closePinCode();
              openModalEmailIfEmailChanged();
            }}
          >
            <span>Abbrechen</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center my-[20px]">
          <SuccessIcon />
          <div className="mt-[20px] text-[24px] text-int-blacks">Bestätigt</div>
        </div>
      )}
    </>
  );
};

export default PinCodeModalContent;
