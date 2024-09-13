import React, { useEffect, useState } from 'react';
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/minus.svg';
import { ReactComponent as AddUserIcon } from '../../../assets/icons/add-user.svg';
import { ReactComponent as CheckBlueIcon } from '../../../assets/icons/check-blue.svg';
import { ReactComponent as HourglassIcon } from '../../../assets/icons/hourglass.svg';
import http from '../../util/http';
import CurrentPatientConsumer from '../CurrentPatient';
import { Modal } from '../../Layout/Modal';
import Onboarding from '../../Onboarding/OnboardingContent/Onboarding';
import { useNavigate } from 'react-router-dom';
import ToastConsumer from '../../../hoc/toastProvider';
import DeletePatientsModalContent from './DeletePatientsModalContent';
import Preloader from '../../Preloader';
import { useRelativePatients } from '../useRelativePatients';
import PatientInvitationItem from './PatientInvitationItem';
import EditPatientInvitation from './EditPatientInvitation';
import usePendingPatients from './usePendingPatients';
import useUnacceptedRelativeRequests from './useUnacceptedRelativeRequests';
import { ReactComponent as Arrow } from '../../../assets/icons/chevron.left.svg';

const PatientContent = () => {
  const { refetch: refetchDataRelativePatients } = useRelativePatients();

  const navigate = useNavigate();
  const { setCurrentPatientId, currentPatientId } = CurrentPatientConsumer();
  const { toast } = ToastConsumer();

  const [isOnboardingOpened, setIsOnboardingOpened] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [editingPatientData, setEditingPatientData] = useState<any[]>([]);

  const [startPatientData, setStartPatientData] = useState<any[]>([]);
  const [editingActivePatientId, setEditingActivePatientId] = useState<number | undefined>(
    currentPatientId!,
  );
  const [startActivePatientId, setStartActivePatientId] = useState<number | undefined>(
    currentPatientId!,
  );
  const [deleteIdArrayPatients, setDeleteIdArrayPatients] = useState<number[]>([]);

  const [isDeletePatientsModal, setIsDeletePatientsModal] = useState<boolean>(false);
  const [isLoadingPatientsData, setIsLoadingPatientsData] = useState<boolean>(true);

  const [idSelectedPatientInvitation, setIdSelectedPatientInvitation] = useState<string | null>(
    null,
  );

  const { data: dataPendingPatients } = usePendingPatients();
  const { data: dataUnacceptedRelativeRequests } = useUnacceptedRelativeRequests();

  const deletePatient = (id: number) => {
    const deletedArrayPatient = [...editingPatientData.filter((item) => id !== item.id)];
    setEditingPatientData(deletedArrayPatient);
    if (id === editingActivePatientId && deletedArrayPatient.length > 0) {
      setEditingActivePatientId(deletedArrayPatient[0].id);
    } else if (deletedArrayPatient.length < 1) {
      setEditingActivePatientId(-1);
    }
    setDeleteIdArrayPatients([...deleteIdArrayPatients, id]);
  };

  const fetchPatientData = () => {
    setIsLoadingPatientsData(true);
    http
      .get('/relatives/relative_patients/')
      .then((res) => {
        setEditingPatientData(res.results);
        setStartPatientData(res.results);
        setDeleteIdArrayPatients([]);
      })
      .finally(() => {
        setIsLoadingPatientsData(false);
      });
  };

  const setApiActivePatientId = () => {
    if (editingActivePatientId !== startActivePatientId && editingActivePatientId !== -1) {
      http
        .patch('/relatives/relatives_profile/me/', { active_patient: editingActivePatientId })
        .then((res) => {
          setEditingActivePatientId(res.active_patient);
          setStartActivePatientId(res.active_patient);
          setCurrentPatientId(res.active_patient);
        })
        .catch(() => {
          setEditingActivePatientId(startActivePatientId);
        });
    }
  };

  const setApiActivePatientIdAndRedirectNews = (id: number) => {
    if (id !== startActivePatientId) {
      setEditingActivePatientId(id);
      http
        .patch('/relatives/relatives_profile/me/', { active_patient: id })
        .then((res) => {
          setCurrentPatientId(res.active_patient);
          navigate('/news');
        })
        .catch(() => {
          setEditingActivePatientId(startActivePatientId);
        });
    }
  };

  const cancelEditFormData = () => {
    setIsEdit(false);
    setEditingPatientData(startPatientData);
    setDeleteIdArrayPatients([]);
    setEditingActivePatientId(startActivePatientId);
  };

  const confirmEditFormData = () => {
    if (deleteIdArrayPatients.length > 0) {
      let requests = deleteIdArrayPatients.map((item) =>
        http.delete(`/relatives/relative_patients/${item}/remove_me_from_relatives/`, {}),
      );
      Promise.all(requests)
        .then((responses) => {
          return responses;
        })
        .then(() => {
          setIsEdit(false);
          fetchPatientData();
          refetchDataRelativePatients();
          toast.success('Speichern erfolgreich');
        })
        .catch(() => {
          toast.error('Fehler speichern');
        });
    } else {
      setIsEdit(false);
      setEditingPatientData(startPatientData);
      setDeleteIdArrayPatients([]);
    }

    setApiActivePatientId();
    setIsDeletePatientsModal(false);
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  return (
    <div className="px-[23px]">
      {idSelectedPatientInvitation === null ? (
        <>
          <div className="mt-[27px] mb-[17px] text-[16px] text-black font-bold text-center">
            Patient:in-Einstellungen
          </div>
          <div className="mt-[27px] mb-[17px] pl-[20px] pr-[20px] text-[16px] text-int-grey-60 text-left">
            Sie können zwischen Ihren im Krankenhaus liegenden Angehörigen wechseln. Kommt ein:e
            Patient:in erneut ins Krankenhaus, kann diese:r hier wiedergefunden werden.
          </div>

          {isEdit ? (
            <div className="mt-[27px] mb-[17px] flex justify-between">
              <span
                className="text-[16px] text-int-dark-blue cursor-pointer"
                onClick={() => cancelEditFormData()}
              >
                Löschen
              </span>
              <span
                className="text-[16px] text-int-dark-blue cursor-pointer font-bold"
                onClick={() => {
                  if (deleteIdArrayPatients.length > 0) {
                    setIsDeletePatientsModal(true);
                  } else {
                    cancelEditFormData();
                  }
                }}
              >
                Fertig
              </span>
            </div>
          ) : (
            <div className="mt-[27px] mb-[17px] text-right">
              <span
                className="text-[16px] text-int-dark-blue cursor-pointer"
                onClick={() => setIsEdit(true)}
              >
                Bearbeiten
              </span>
            </div>
          )}
          {editingPatientData?.length! > 0 && (
            <div
              className={`pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] ${
                isEdit && 'ml-[40px]'
              } rounded-[10px] shadow-resultCard`}
            >
              {isLoadingPatientsData && (
                <div className="flex items-center justify-center">
                  <Preloader small={true} />
                </div>
              )}
              {editingPatientData.map((item, index) => (
                <div key={item.id} className="relative">
                  {isEdit && (
                    <div
                      className="flex justify-center items-center w-[26px] h-[26px] rounded-full bg-[#EB5757] mr-[15px] absolute -left-[55px] cursor-pointer"
                      onClick={() => deletePatient(item.id)}
                    >
                      <MinusIcon />
                    </div>
                  )}

                  <div
                    className={`flex justify-between items-center ${
                      item.id !== editingActivePatientId && !isEdit && 'cursor-pointer'
                    }`}
                    onClick={() =>
                      isEdit ? undefined : setApiActivePatientIdAndRedirectNews(item.id)
                    }
                  >
                    <div className="flex items-center relative">
                      <span className="text-int-black">
                        {item.first_name} {item.last_name}
                      </span>
                    </div>
                    {item.id === editingActivePatientId && <CheckBlueIcon />}
                  </div>
                  {index !== editingPatientData.length - 1 && (
                    <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
                  )}
                </div>
              ))}
            </div>
          )}
          {dataPendingPatients?.results.length! > 0 && (
            <div
              className={`pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] shadow-resultCard`}
            >
              {dataPendingPatients?.results.map((item, index) => (
                <div key={item.id} className="relative">
                  <div className={`flex justify-between items-center`}>
                    <div className="flex items-center relative">
                      <span className="text-[#B2BAC6]">
                        {item.patient.first_name} {item.patient.last_name}
                      </span>
                    </div>
                    <HourglassIcon />
                  </div>
                  {index !== dataPendingPatients.results.length - 1 && (
                    <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Check Ticket INT-349
          Relative Web app + Nativ mobile apps : hide add patient button */}
          {/* <div
            className="w-[100%] pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] relative before:-z-[1] shadow-resultCard cursor-pointer"
            onClick={() => setIsOnboardingOpened(true)}
          >
            <div className="flex justify-between flex-wrap gap-5">
              <div className="flex items-center">
                <AddUserIcon className="mr-[18px]" />
                <span className="text-int-black">Patient:in hinzufügen</span>
              </div>
              <div className="flex justify-center items-center w-[26px] h-[26px] rounded-full bg-[#5AAF3C]">
                <PlusIcon />
              </div>
            </div>
          </div> */}

          {dataUnacceptedRelativeRequests?.results.length !== 0 && (
            <>
              <div className="mt-[27px] mb-[17px] pr-[20px] text-[16px] text-int-grey-60 text-left">
                Sie haben neue Einladungen zu Angehörigen, die im Krankenhaus sind. Verbinden Sie
                sich jetzt.
              </div>
              {dataUnacceptedRelativeRequests?.results.map((item) => (
                <PatientInvitationItem
                  key={item.id}
                  firstName={item.patient.first_name}
                  lastName={item.patient.last_name}
                  onClick={() => setIdSelectedPatientInvitation(item.id)}
                />
              ))}
            </>
          )}
        </>
      ) : (
        <EditPatientInvitation
          idSelectedPatientInvitation={idSelectedPatientInvitation}
          setIdSelectedPatientInvitation={setIdSelectedPatientInvitation}
          fetchPatientData={fetchPatientData}
        />
      )}

      {isOnboardingOpened && (
        <Modal
          width={700}
          closeModal={() => setIsOnboardingOpened(false)}
          title={(
            <b>
              Patient:in hinzufügen
            </b>
          )}
        >
          <Onboarding closeModal={() => setIsOnboardingOpened(false)} />
        </Modal>
      )}
      {isDeletePatientsModal && (
        <Modal
          closeModal={() => setIsDeletePatientsModal(false)}
          title={(
            <b>
              Patient löschen
            </b>
          )}
        >
          <DeletePatientsModalContent
            closeModal={() => setIsDeletePatientsModal(false)}
            applyModal={() => confirmEditFormData()}
          />
        </Modal>
      )}
    </div>
  );
};

export default PatientContent;
