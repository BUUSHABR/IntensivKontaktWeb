import React, { useEffect, useState } from 'react';
import NewsHeader from '../components/News/NewsHeader';
import { ReactComponent as ProfileContactsIcon } from '../assets/icons/profile-contacts-icon.svg';
import { ReactComponent as ProfileNotificationsIcon } from '../assets/icons/profile-notifications-icon.svg';
import { ReactComponent as ProfileInviteRelativesIcon } from '../assets/icons/profile-invite-relatives-icon.svg';
import { ReactComponent as ProfileChangePatientIcon } from '../assets/icons/profile-change-patient-icon.svg';
import { ReactComponent as ProfileAssignmentIcon } from '../assets/icons/profile_assignment_icon.svg';
import { ReactComponent as EditAvatarIcon } from '../assets/icons/edit-avatar-icon.svg';
import { ReactComponent as ProfileDefaultAvatar } from '../assets/icons/profile-default-avatar.svg';
import { ReactComponent as SuperRelStaricon } from '../assets/icons/super_rel_star.svg';
import { LeftMenu } from '../components/LeftMenu/LeftMenu';
import useAvatar from '../components/User/useAvatar';
import { Modal } from '../components/Layout/Modal';
import AvatarLoadingModalContent from '../components/Mehr/AvatarLoadingModalContent';
import AccountMenuItem from '../components/Mehr/AccountMenuItem';
import MainContent from '../components/Mehr/MainContent/MainContent';
import NotificationContent from '../components/Mehr/NotificationContent/NotificationContent';
import PatientContent from '../components/Mehr/PatientContent/PatientContent';
import RelativesContent from '../components/Mehr/RelativesContent/RelativesContent';
import CurrentPatientConsumer from '../components/Mehr/CurrentPatient';
import http from '../components/util/http';
import Footer from '../components/Footer';
import { useRelativePatients } from '../components/Mehr/useRelativePatients';
import { FButton } from '../styles/form';
import Onboarding from '../components/Onboarding/OnboardingContent/Onboarding';
import { useSuperRelative } from '../components/Mehr/useSuperRelative';
import AddAvatarOptions from '../components/Mehr/AddAvatarOptions';
import ToastConsumer from '../hoc/toastProvider';
import DeleteAvatarModalContent from '../components/Mehr/DeleteAvatarModalContent';
import AssignmentContent from '../components/Mehr/AssignmentContent/AssignmentContent';
import useAssignmentRelativeRequests from '../components/Mehr/AssignmentContent/useAssignmentRelativeRequests';
import useAuthUsersMe from '../components/Mehr/MainContent/useAuthUsersMe';
import useUnacceptedRelativeRequests from "../components/Mehr/PatientContent/useUnacceptedRelativeRequests";
import PhotoAvatarCamera from '../components/Mehr/PhotoAvatarCamera';
import Preloader from '../components/Preloader';
import useRealtivesProfileMe from '../components/Mehr/useRelativesProfileMe';

const MehrPage = () => {
  const { toast } = ToastConsumer();

  const avatar = useAvatar();
  const { currentPatientId, setCurrentPatientId } = CurrentPatientConsumer();

  const { data: dataRelativePatients, isSuccess: dataRelativePatientsSuccess } =
    useRelativePatients();

  const { data: dataUnacceptedRelativeRequests, isSuccess: dataUnacceptedRelativeRequestsSuccess } =
    useUnacceptedRelativeRequests();
  const { isError, isLoading: isRelativeProfileLoading } = useRealtivesProfileMe();

  const { data: dataAuthUsersMe } = useAuthUsersMe();

  const { data: superRel, refetch: refetchSuperRel } = useSuperRelative(currentPatientId!);

  const { data: assignmentRelativeRequestsData } = useAssignmentRelativeRequests(
    currentPatientId!,
    superRel!,
  );

  const [isAvatarModal, setIsAvatarModal] = useState<boolean>(false);
  const [isOpenAddAvatarOptions, setIsOpenAddAvatarOptions] = useState<boolean>(false);
  const [isOpenDeleteAvatarModal, setIsOpenDeleteAvatarModal] = useState<boolean>(false);
  const [isOnboardingOpened, setIsOnboardingOpened] = useState(false);
  const [menuItem, setMenuItem] = useState<string>(superRel ? 'assignment' : 'main');

  const [patientFirstName, setPatientFirstName] = useState<string>('');
  const [patientLastName, setPatientLastName] = useState<string>('');
  const [relation, setRelation] = useState<string>('');

  const [isPhotoAvatarCameraOpen, setIsPhotoAvatarCameraOpen] = useState<boolean>(false);
  const [photoAvatar, setPhotoAvatar] = useState<any>(null);

  useEffect(() => {
    if (currentPatientId) {
      http.get(`/relatives/relative_patients/${currentPatientId}/`).then((res) => {
        setPatientFirstName(res.first_name);
        setPatientLastName(res.last_name);
        setRelation(res.relation);
      });
    }
  }, [currentPatientId]);

  useEffect(() => {
    if (superRel === true) {
      setMenuItem('assignment');
    } else {
      setMenuItem('main');
    }
  }, [superRel]);

  useEffect(() => {
    if (dataRelativePatients?.length === 0) {
      setCurrentPatientId(null);
    }
    if (dataRelativePatients?.length === 0 && currentPatientId) {
      refetchSuperRel();
    }
  }, [dataRelativePatients, currentPatientId]);

  const openAvatarModal = () => {
    setIsAvatarModal(true);
  };
  const closeAvatarModal = () => {
    setIsAvatarModal(false);
  };

  const deleteAvatar = () => {
    http
      .delete('/auth/profile_picture/me/', {})
      .then(() => {
        avatar.refetch();
        toast.success('Delete avatar');
      })
      .catch(() => {
        toast.error('Not delete avatar');
      });
  };

  if ((isError && !isRelativeProfileLoading) || isRelativeProfileLoading) {
    return (
      <div>
        <Preloader
          error="Ihr relatives Profil existiert nicht! bitte verwenden Sie ein anderes Konto oder stellen Sie sicher, dass Sie ein relatives Profil haben"
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-white">
      <NewsHeader />
      <div className="flex justify-center">
        <div className="flex items-center max-w-[1512px] min-w-[600px] w-screen">
          <LeftMenu />
          <div className="bg-[#FAFAFA] w-6/12 min-w-[360px] border-r border-[#ECEFF0]">
            <div className="px-[23px] h-[calc(100vh-88px)]">
              <div className="flex flex-col items-center">
                <span className="mt-[27px] mb-[17px] text-[16px] text-black font-bold">
                  Account-Daten
                </span>
                <div className="relative w-[63px] h-[63px] mt-[20px] mb-[10px] cursor-pointer">
                  <div
                    className="flex justify-center items-center w-[63px] h-[63px] rounded-full bg-[#CBCFD5]  border border-[#ECEFF0]  overflow-hidden"
                    onClick={() => {
                      setIsOpenAddAvatarOptions(true);
                    }}
                  >
                    {avatar.isError || avatar.data?.avatar === null ? (
                      <ProfileDefaultAvatar />
                    ) : avatar.isFetching || avatar.isLoading || avatar.isRefetching ? (
                      <Preloader small={true} />
                    ) : (
                      <img src={avatar.data?.avatar} alt="" />
                    )}
                  </div>
                  <div className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-[#FAFAFA] border border-white absolute -bottom-[6px] -right-[4px]">
                    <EditAvatarIcon />
                  </div>
                  {isOpenAddAvatarOptions && (
                    <AddAvatarOptions
                      open={isOpenAddAvatarOptions}
                      setOpen={setIsOpenAddAvatarOptions}
                      openAvatarModal={openAvatarModal}
                      setIsOpenDeleteAvatarModal={setIsOpenDeleteAvatarModal}
                      avatar={avatar.data?.avatar}
                      setIsPhotoAvatarCameraOpen={setIsPhotoAvatarCameraOpen}
                    />
                  )}
                </div>
                <div className=" flex flex-row items-center text-2xl text-black font-bold">
                  <div className="mr-[10px]">{superRel && <SuperRelStaricon />}</div>
                  <div className="mr-[6px] text-center">
                    <span>
                      {dataAuthUsersMe && dataAuthUsersMe?.first_name}{' '}
                      {dataAuthUsersMe && dataAuthUsersMe?.last_name}
                    </span>
                  </div>
                </div>
                <span className="text-sm accent-int-grey-90 mb-[16px]">
                  {relation === '' ? 'Angehörige:r' : relation} {'von '} : {patientFirstName}{' '}
                  {patientLastName}
                </span>
              </div>
              <div>
                {superRel && (
                  <AccountMenuItem
                    title="Angehörige freischalten"
                    icon={<ProfileAssignmentIcon />}
                    bgIcon={'#D3E4E8'}
                    active={menuItem === 'assignment'}
                    onClick={() => setMenuItem('assignment')}
                    disabled={dataRelativePatientsSuccess && dataRelativePatients.length < 1}
                    counter={assignmentRelativeRequestsData?.count}
                  />
                )}
                <AccountMenuItem
                  title="Meine Kontaktdaten"
                  icon={<ProfileContactsIcon />}
                  bgIcon={'#E8D3D3'}
                  active={menuItem === 'main'}
                  onClick={() => setMenuItem('main')}
                />
                <AccountMenuItem
                  title="Benachrichtigungen"
                  icon={<ProfileNotificationsIcon />}
                  bgIcon={'#DAE8D3'}
                  active={menuItem === 'notification'}
                  onClick={() => setMenuItem('notification')}
                />
                <AccountMenuItem
                  title="Angehörige einladen"
                  icon={<ProfileInviteRelativesIcon />}
                  bgIcon={'#E1D3E8'}
                  active={menuItem === 'relatives'}
                  onClick={() => setMenuItem('relatives')}
                  disabled={dataRelativePatientsSuccess && dataRelativePatients.length < 1}
                />
                <AccountMenuItem
                  title="Patient:in Einstellungen"
                  icon={<ProfileChangePatientIcon />}
                  bgIcon={'#F1ECD0'}
                  active={menuItem === 'patient'}
                  onClick={() => setMenuItem('patient')}
                  disabled={dataRelativePatientsSuccess && dataRelativePatients.length < 1 &&
                    dataUnacceptedRelativeRequestsSuccess && dataUnacceptedRelativeRequests.results.length < 1 }
                />
                {/* Check Ticket INT-349
                  Relative Web app + Nativ mobile apps : hide add patient button */}
                {/* {dataRelativePatientsSuccess && dataRelativePatients.length < 1 && (
                  <div className="mt-[60px]">
                    <FButton dark={true} onClick={() => setIsOnboardingOpened(true)}>
                      ZU PATIENTEN ZUORDNEN
                    </FButton>
                  </div>
                )} */}

              </div>
            </div>
          </div>

          <div className="flex flex-col w-[100%] bg-[#FAFAFA] overflow-y-auto h-[calc(100vh-88px)]">
            {menuItem === 'assignment' && <AssignmentContent />}
            {menuItem === 'main' && <MainContent />}
            {menuItem === 'notification' && <NotificationContent />}
            {menuItem === 'relatives' && <RelativesContent />}
            {menuItem === 'patient' && <PatientContent />}
          </div>
        </div>
      </div>
      {isPhotoAvatarCameraOpen && (
        <PhotoAvatarCamera
          setIsPhotoAvatarCameraOpen={setIsPhotoAvatarCameraOpen}
          setPhotoAvatar={setPhotoAvatar}
          setIsAvatarModal={setIsAvatarModal}
        />
      )}
      {isAvatarModal && (
        <Modal closeModal={closeAvatarModal} title={(<b>Profilbild auswählen</b>)}>
          <AvatarLoadingModalContent
            closeAvatarModal={closeAvatarModal}
            avatar={avatar}
            photoAvatar={photoAvatar}
            setPhotoAvatar={setPhotoAvatar}
          />
        </Modal>
      )}
      {isOnboardingOpened && (
        <Modal closeModal={() => setIsOnboardingOpened(false)} width={700} title={(<b>Patient:in hinzufügen</b>)}>
          <Onboarding closeModal={() => setIsOnboardingOpened(false)} />
        </Modal>
      )}
      {isOpenDeleteAvatarModal && (
        <Modal closeModal={() => setIsOpenDeleteAvatarModal(false)} title={(<b>Profilbild löschen</b>)}>
          <DeleteAvatarModalContent
            closeModal={() => setIsOpenDeleteAvatarModal(false)}
            applyModal={deleteAvatar}
          />
        </Modal>
      )}
      <Footer />
    </div>
  );
};

export default MehrPage;
