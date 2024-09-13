import React from 'react';
import { FButton } from '../../../styles/form';

type DeletePatientsModalContentProps = {
  closeModal: () => void;
  applyModal: () => void;
};

const DeletePatientsModalContent = ({
  closeModal,
  applyModal,
}: DeletePatientsModalContentProps) => {
  return (
    <div>
      <div className="text-int-black font-bold mb-[20px] text-center">
        Sind Sie sich sicher, dass Sie diesen Patienten löschen wollen?
      </div>
      <FButton dark={true} onClick={applyModal}>
        Löschen
      </FButton>
      <div className="text-center mt-[20px] text-[#6D9CB7] cursor-pointer" onClick={closeModal}>
        <span>Abbrechen</span>
      </div>
    </div>
  );
};

export default DeletePatientsModalContent;
