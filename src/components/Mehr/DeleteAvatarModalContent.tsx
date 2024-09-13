import React from 'react';
import { FButton } from '../../styles/form';

type DeleteAvatarModalContentProps = {
  closeModal: () => void;
  applyModal: () => void;
};

const DeleteAvatarModalContent = ({
  closeModal,
  applyModal,
}: DeleteAvatarModalContentProps) => {
  return (
    <div>
      <div className="text-int-black font-bold mb-[20px] text-center">
          Möchten Sie das Foto des Benutzers wirklich löschen?
      </div>
      <FButton dark={true} onClick={()=>{
          closeModal();
          applyModal();
      }}>
        Löschen
      </FButton>
      <div className="text-center mt-[20px] text-[#6D9CB7] cursor-pointer" onClick={closeModal}>
        <span>Abbrechen</span>
      </div>
    </div>
  );
};

export default DeleteAvatarModalContent;
