import React from 'react';
import { FButton } from '../../../styles/form';
import http from '../../util/http';
import ToastConsumer from '../../../hoc/toastProvider';

type ChangeMailModalContentProps = {
  closeModal: () => void;
};

const ChangeMailModalContent = ({ closeModal }: ChangeMailModalContentProps) => {
  const { toast } = ToastConsumer();

  const resendEmail = () => {
    http
      .put('/auth/users/resend_email_changing_mail/', {})
      .then(() => {
        toast.success('Resend Email');
      })
      .catch(() => {
        toast.error('Error Resend Email');
      });
  };

  return (
    <div>
      <div className="text-int-black font-bold mb-[20px] text-center">
        Bitte bestätigen Sie Ihre E-Mail-Adresse, Ihren Bestätigungslink erhalten <br /> Sie per
        E-Mail
      </div>
      <div className="text-int-black text-[14px] mb-[20px] text-center">
        Falls Sie keine E-Mail erhalten haben, klicken Sie hier, um die E-Mail erneut zugeschickt zu
        bekommen.
      </div>
      <div className="text-int-black text-[14px] mb-[20px] text-center">
        Bitte prüfen Sie Ihr E-Mail Postfach und Ihren Spam-Ordner.
      </div>
      <FButton
        dark={true}
        onClick={() => {
          resendEmail();
        }}
      >
        E-Mail nochmal senden
      </FButton>
      <div className="text-center mt-[20px] text-[#6D9CB7] cursor-pointer" onClick={closeModal}>
        <span>Später bestätigen</span>
      </div>
    </div>
  );
};

export default ChangeMailModalContent;
