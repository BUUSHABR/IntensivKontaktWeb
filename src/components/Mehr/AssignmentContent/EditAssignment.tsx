import React, { useState } from 'react';
import { ReactComponent as Arrow } from '../../../assets/icons/chevron.left.svg';
import { FButton, FRedButton } from '../../../styles/form';
import CurrentPatientConsumer from '../CurrentPatient';
import http from '../../util/http';
import ToastConsumer from '../../../hoc/toastProvider';
import useAssignmentRelativeRequests from './useAssignmentRelativeRequests';
import { useSuperRelative } from '../useSuperRelative';

type EditAssignmentType = {
  idSelectedAssignment: string | null;
  setIdSelectedAssignment: any;
};

const EditAssignment = ({ idSelectedAssignment, setIdSelectedAssignment }: EditAssignmentType) => {
  const { toast } = ToastConsumer();

  const { currentPatientId } = CurrentPatientConsumer();

  const { data: superRel } = useSuperRelative(currentPatientId!);

  const [deleteDisableButton, setDeleteDisableButton] = useState(false);
  const [confirmDisableButton, setConfirmDisableButton] = useState(false);

  const {
    data: dataAssignmentRelativeRequests,
    refetch: refetchAssignmentRelativeRequests,
    isSuccess: isSuccessAssignmentRelativeRequests,
  } = useAssignmentRelativeRequests(currentPatientId!, superRel!);

  const deleteAssignment = () => {
    setDeleteDisableButton(true);
    http
      .delete(`/contacts/add_relative_requests/${currentPatientId}/${idSelectedAssignment}/`, {})
      .then((res) => {
        setIdSelectedAssignment(null);
        refetchAssignmentRelativeRequests();
        toast.success('Anfrage gelöscht');
      })
      .catch(() => {
        toast.error('Löschfehler anfordern');
      })
      .finally(() => {
        setDeleteDisableButton(false);
      });
  };

  const confirmAssignment = () => {
    setConfirmDisableButton(true);
    http
      .post(
        `/contacts/add_relative_requests/${currentPatientId}/confirm_request/${idSelectedAssignment}/`,
        { confirm_as_super_relative: false },
      )
      .then((res) => {
        setIdSelectedAssignment(null);
        refetchAssignmentRelativeRequests();
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
            onClick={() => setIdSelectedAssignment(null)}
          >
            <Arrow />
            <span className="pl-[5px]">Zurück</span>
          </div>
          <span>Offene Einladungen</span>
        </div>
      </div>

      <div className="mt-[27px] mb-[17px] text-right"></div>
      <div className="w-[100%] pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] shadow-resultCard">
        <div className="flex justify-between items-center">
          <span className="text-int-black">Vorname</span>
          <span className="text-int-grey-60">
            {isSuccessAssignmentRelativeRequests &&
              dataAssignmentRelativeRequests?.results.find(
                (item) => item.id === idSelectedAssignment,
              )?.user.first_name}
          </span>
        </div>
        <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
        <div className="flex justify-between items-center">
          <span className="text-int-black">Nachname</span>
          <span className="text-int-grey-60">
            {isSuccessAssignmentRelativeRequests &&
              dataAssignmentRelativeRequests?.results.find(
                (item) => item.id === idSelectedAssignment,
              )?.user.last_name}
          </span>
        </div>
        <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
        <div className="flex justify-between items-center">
          <span className="text-int-black">Handynummer</span>
          <span className="text-int-grey-60">
            {isSuccessAssignmentRelativeRequests &&
              dataAssignmentRelativeRequests?.results.find(
                (item) => item.id === idSelectedAssignment,
              )?.user.phone}
          </span>
        </div>
        <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
        <div className="flex justify-between items-center">
          <span className="text-int-black">Beziehung</span>
          <span className="text-int-grey-60">
            {isSuccessAssignmentRelativeRequests &&
              dataAssignmentRelativeRequests?.results.find(
                (item) => item.id === idSelectedAssignment,
              )?.patient_relation}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center mt-[10px]">
        <div className="flex flex-col items-center justify-center pt-[24px] pb-[24px]">
          <div className="max-w-[350px] w-[100%] pb-[8px]">
            <FButton disabled={confirmDisableButton} dark={true} onClick={confirmAssignment}>
              ANGEHÖRIGEN ZULASSEN
            </FButton>
          </div>
          <div className="max-w-[350px] w-[100%]">
            <FRedButton disabled={deleteDisableButton} onClick={deleteAssignment}>
              ANGEHÖRIGEN ABLEHNEN
            </FRedButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAssignment;
