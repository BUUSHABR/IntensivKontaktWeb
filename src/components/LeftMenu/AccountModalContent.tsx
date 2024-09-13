import { FButton } from '../../styles/form';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../util/http';
import ToastConsumer from '../../hoc/toastProvider';

type AccountModalContentType = {
  closeModal: () => void;
};

const AccountModalContent = ({ closeModal }: AccountModalContentType) => {
  const navigate = useNavigate();
  const { toast } = ToastConsumer();

  const deleteAccount = () => {
    http
      .delete('/auth/users/me/', {})
      .then(() => {
        toast.success('Benutzer gelöscht');
        navigate('/logout');
        closeModal();
      })
      .catch(() => {
        toast.error('Fehler beim Löschen des Benutzers');
      });
  };

  return (
    <div>
      <div className="text-int-grey-60 mb-[20px]">
        Wenn Sie Ihren Accout löschen, müssen Sie sich neu registrieren, wenn Sie IntensivKontakt
        noch einmal nutzen möchten. Sie können Ihren Account behalten, auch wenn Ihr:e Angehörige:r
        entlassen wird. Ihre Daten sind sicher aufbewahrt, es entstehen keine Kosten und Sie
        erhalten keine Benachrichtigungen.
      </div>
      <div className="text-int-grey-60 mb-[20px]">
        Sollten Sie IntensivKontakt erneut benötigen, können Sie die App einfach wieder
        herunterladen und sind sofort angemeldet.
      </div>
      <FButton dark={true} onClick={() => closeModal()}>
        Account behalten
      </FButton>
      <div className="text-center underline mt-[20px] text-[#6D9CB7] cursor-pointer" onClick={deleteAccount}>
        <span>Account trotzdem löschen</span>
      </div>
    </div>
  );
};

export default AccountModalContent;
