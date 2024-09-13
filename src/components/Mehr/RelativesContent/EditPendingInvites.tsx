import React, { useState } from 'react';
import { ReactComponent as Arrow } from '../../../assets/icons/chevron.left.svg';
import { FButton, FRedButton } from '../../../styles/form';
import { useRelativesPendingInvites } from './useRelativesPendingInvites';
import CurrentPatientConsumer from '../CurrentPatient';
import http from '../../util/http';
import ToastConsumer from '../../../hoc/toastProvider';

type EditPendingInvitesType = {
  selectedInvitation: any;
  setSelectedInvitation: any;
};

const EditPendingInvites = ({
  selectedInvitation,
  setSelectedInvitation,
}: EditPendingInvitesType) => {
  const { toast } = ToastConsumer();
  const { currentPatientId } = CurrentPatientConsumer();
  const {
    refetch: refetchRelativesPendingInvites
  } = useRelativesPendingInvites();

  const [resendDisableButton, setResendDisableButton] = useState(false);
  const [deleteDisableButton, setDeleteDisableButton] = useState(false);

  const resendInvitation = () => {
    setResendDisableButton(true);
    http
      .post(`/contacts/invitations/${currentPatientId}/${selectedInvitation.id}/resend_invitation/`, {})
      .then(() => {
        toast.success('Einladung erneut gesendet');
      })
      .catch(() => {
        toast.error('Einladung nicht gesendet');
      })
      .finally(() => {
        setResendDisableButton(false);
      });
  };

  const deleteInvitation = () => {
    setDeleteDisableButton(true);
    http
      .delete(`/contacts/invitations/${currentPatientId}/${selectedInvitation.id}/`, {})
      .then((res) => {
        setSelectedInvitation(null);
        refetchRelativesPendingInvites();
        toast.success('Einladung entfernt');
      })
      .catch(() => {
        toast.error('Einladung nicht gelöscht');
      })
      .finally(() => {
        setDeleteDisableButton(false);
      });
  };

  return (
    <>
      <div>
        <div className="mt-[27px] mb-[17px] text-[16px] text-black font-bold text-center relative">
          <div
            className="text-[16px] text-int-dark-blue font-normal cursor-pointer absolute flex flex-row items-center"
            onClick={() => setSelectedInvitation(null)}
          >
            <Arrow />
            <span className="pl-[5px]">Angehörige einladen</span>
          </div>
          <span>Offene Einladungen</span>
        </div>
      </div>

      <div className="mt-[27px] mb-[17px] text-right"></div>
      <div className="w-[100%] pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] shadow-resultCard">
        <div className="flex justify-between items-center">
          <span className="text-int-black">Vorname</span>
          <span className="text-int-grey-60">
            {selectedInvitation.user.first_name}
          </span>
        </div>
        <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
        <div className="flex justify-between items-center">
          <span className="text-int-black">Nachname</span>
          <span className="text-int-grey-60">
            {selectedInvitation.user.last_name }
          </span>
        </div>
        <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />

        {selectedInvitation.user.email !== '' && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-int-black">E-Mail-Adresse</span>
                <span className="text-int-grey-60">
                  {selectedInvitation.user.email}
                </span>
              </div>
              <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
            </>
          )}

        {selectedInvitation.user.phone !== ''  && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-int-black">Handynummer</span>
                <span className="text-int-grey-60">
                  {selectedInvitation.user.phone}
                </span>
              </div>
              <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
            </>
          )}

        <div className="flex justify-between items-center">
          <span className="text-int-black">Beziehung</span>
          <span className="text-int-grey-60">
            {selectedInvitation.patient_relation}
          </span>
        </div>
        <hr className="mt-[11px] mr-[-15px] border-int-light-blue" />
        <div className="flex flex-col justify-center mt-[10px]">
          <div className="flex flex-col items-center justify-center pt-[24px] pb-[24px]">
            <div className="max-w-[350px] w-[100%] pb-[8px]">
              <FButton
                dark={true}
                onClick={() => resendInvitation()}
                disabled={resendDisableButton}
              >
                Einladung erneut versenden
              </FButton>
            </div>
            <div className="max-w-[350px] w-[100%]">
              <FRedButton
                onClick={() => deleteInvitation()}
                disabled={deleteDisableButton}
              >
                Einladung zurückziehen
              </FRedButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPendingInvites;
