import React from 'react';
import { FButton } from '../../../styles/form';

type DeletePatientInvitationModalContentType = {
  applyModal: () => void;
};

const DeletePatientInvitationModalContent = ({
  applyModal,
}: DeletePatientInvitationModalContentType) => {
  return (
    <div>
      <div className="text-int-black font-bold mb-[20px] text-center">
          Sind Sie sich sicher, dass Sie diese Einladung ablehnen möchten?
      </div>
      <FButton dark={true} onClick={applyModal}>
          Ablehnen
      </FButton>
    </div>
  );
};

export default DeletePatientInvitationModalContent;
