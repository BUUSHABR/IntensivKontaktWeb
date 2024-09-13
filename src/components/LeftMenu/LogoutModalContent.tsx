import { FButton } from '../../styles/form';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type LogoutModalContentType = {
  closeModal: () => void;
};

const LogoutModalContent = ({ closeModal }: LogoutModalContentType) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="text-int-grey-60 mb-[20px] mt-[10px] text-center text-int-black font-bold">
        Möchten Sie sich wirklich abmelden?
      </div>
      <div className="text-int-grey-60 mb-[20px] text-center">
        Ihre Daten sind in der IntensivKontakt App sicher. Wenn Sie sich jetzt abmelden, erhalten
        Sie keine weiteren Benachrichtigungen und können an keinen virtuellen Besuchen teilnehmen.
        <br />
        <br />
        Möchten Sie sich trotzdem abmelden?
      </div>
      <FButton dark={true} onClick={() => navigate('/logout')}>
        Abmelden
      </FButton>
      <div className="text-center mt-[20px] text-[#6D9CB7] cursor-pointer" onClick={closeModal}>
        <span>Abbrechen</span>
      </div>
    </div>
  );
};

export default LogoutModalContent;
