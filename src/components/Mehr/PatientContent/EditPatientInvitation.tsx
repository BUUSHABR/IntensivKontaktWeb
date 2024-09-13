import React, { useState } from 'react';
import { ReactComponent as Arrow } from '../../../assets/icons/chevron.left.svg';
import { FButton, FRedButton } from '../../../styles/form';
import http from '../../util/http';
import ToastConsumer from '../../../hoc/toastProvider';
import useUnacceptedRelativeRequests from './useUnacceptedRelativeRequests';
import { useRelativePatients } from '../useRelativePatients';
import { Modal } from '../../Layout/Modal';
import DeletePatientInvitationModalContent from './DeletePatientInvitationModalContent';

type EditPatientInvitationType = {
  idSelectedPatientInvitation: string | null;
  setIdSelectedPatientInvitation: any;
  fetchPatientData: () => void;
};

const EditPatientInvitation = ({
  idSelectedPatientInvitation,
  setIdSelectedPatientInvitation,
  fetchPatientData,
}: EditPatientInvitationType) => {
  const [deleteDisableButton, setDeleteDisableButton] = useState(false);
  const [confirmDisableButton, setConfirmDisableButton] = useState(false);

  const [isDeletePatientsInvitationModal, setIsDeletePatientsInvitationModal] =
    useState<boolean>(false);

  const { toast } = ToastConsumer();

  const {
    data: dataUnacceptedRelativeRequests,
    refetch: refetchUnacceptedRelativeRequests,
    isSuccess: isSuccessUnacceptedRelativeRequests,
  } = useUnacceptedRelativeRequests();

  const { refetch: refetchDataRelativePatients } = useRelativePatients();

  const deletePendingPatient = () => {
    const patientId = dataUnacceptedRelativeRequests?.results.find(
      (item) => item.id === idSelectedPatientInvitation,
    )?.patient.id;
    setDeleteDisableButton(true);
    http
      .delete(`/contacts/add_relative_requests/${patientId}/${idSelectedPatientInvitation}/`, {})
      .then((res) => {
        setIdSelectedPatientInvitation(null);
        refetchUnacceptedRelativeRequests();
        refetchDataRelativePatients();
        fetchPatientData();
        toast.success('Anfrage gelöscht');
        setIsDeletePatientsInvitationModal(false);
      })
      .catch(() => {
        toast.error('Löschfehler anfordern');
      })
      .finally(() => {
        setDeleteDisableButton(false);
      });
  };

  const acceptPendingPatient = () => {
    const patientId = dataUnacceptedRelativeRequests?.results.find(
      (item) => item.id === idSelectedPatientInvitation,
    )?.patient.id;
    setConfirmDisableButton(true);
    http
      .post(
        `/contacts/add_relative_requests/${patientId}/accept_request/${idSelectedPatientInvitation}/`,
        {},
      )
      .then((res) => {
        setIdSelectedPatientInvitation(null);
        refetchUnacceptedRelativeRequests();
        refetchDataRelativePatients();
        fetchPatientData();
        toast.success('Anfrage bestätigt');
      })
      .catch(() => {
        toast.error('Validierungsfehler anfordern');
      })
      .finally(() => {
        setConfirmDisableButton(false);
      });
  };

  return (
    <>
      <div>
        <div className="mt-[27px] mb-[17px] text-[16px] text-black font-bold text-center relative">
          <div
            className="text-[16px] text-int-dark-blue font-normal cursor-pointer absolute flex flex-row items-center"
            onClick={() => setIdSelectedPatientInvitation(null)}
          >
            <Arrow />
            <span className="pl-[5px]">Zurück</span>
          </div>
          <span>
            {isSuccessUnacceptedRelativeRequests &&
              dataUnacceptedRelativeRequests.results.find(
                (item) => item.id === idSelectedPatientInvitation,
              )?.patient.first_name}{' '}
            {isSuccessUnacceptedRelativeRequests &&
              dataUnacceptedRelativeRequests.results.find(
                (item) => item.id === idSelectedPatientInvitation,
              )?.patient.last_name}
          </span>
        </div>
      </div>

      <div className="mt-[27px] mb-[17px] text-right"></div>
      <div className="w-[100%] pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] shadow-resultCard">
        <div className="flex justify-between items-center">
          <span className="text-int-black">Vorname</span>
          <span className="text-int-grey-60">
            {isSuccessUnacceptedRelativeRequests &&
              dataUnacceptedRelativeRequests.results.find(
                (item) => item.id === idSelectedPatientInvitation,
              )?.patient.first_name}
          </span>
        </div>
        <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
        <div className="flex justify-between items-center">
          <span className="text-int-black">Nachname</span>
          <span className="text-int-grey-60">
            {isSuccessUnacceptedRelativeRequests &&
              dataUnacceptedRelativeRequests.results.find(
                (item) => item.id === idSelectedPatientInvitation,
              )?.patient.last_name}
          </span>
        </div>
        <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
        <div className="flex justify-between items-center">
          <span className="text-int-black">Krankenhaus</span>
          <span className="text-int-grey-60">
            {isSuccessUnacceptedRelativeRequests &&
              dataUnacceptedRelativeRequests.results.find(
                (item) => item.id === idSelectedPatientInvitation,
              )?.patient.hospital}
          </span>
        </div>
        <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
        <div className="flex justify-between items-center">
          <span className="text-int-black">Station</span>
          <span className="text-int-grey-60">
            {isSuccessUnacceptedRelativeRequests &&
              dataUnacceptedRelativeRequests.results.find(
                (item) => item.id === idSelectedPatientInvitation,
              )?.patient.station}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center mt-[10px]">
        <div className="flex flex-col items-center justify-center pt-[24px] pb-[24px]">
          <div className="max-w-[350px] w-[100%] pb-[8px]">
            <FButton dark={true} onClick={acceptPendingPatient} disabled={confirmDisableButton}>
              Einladung annehmen
            </FButton>
          </div>
          <div className="max-w-[350px] w-[100%]">
            <FRedButton
              onClick={() => setIsDeletePatientsInvitationModal(true)}
              disabled={deleteDisableButton}
            >
              Einladung ablehnen
            </FRedButton>
          </div>
        </div>
      </div>

      {isDeletePatientsInvitationModal && (
        <Modal title={(<b>Einladung löschen</b>)} closeModal={() => setIsDeletePatientsInvitationModal(false)}>
          <DeletePatientInvitationModalContent
            applyModal={() => deletePendingPatient()}
          />
        </Modal>
      )}
    </>
  );
};

export default EditPatientInvitation;
