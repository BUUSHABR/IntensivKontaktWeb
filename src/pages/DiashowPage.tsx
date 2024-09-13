import React, { useEffect, useState } from 'react';
import { usePatient } from 'components/User/usePatients';
import { Helmet } from 'react-helmet';
import { useDiashowId } from '../components/Diashow/useDiashowId';
import CurrentPatientConsumer from '../components/Mehr/CurrentPatient';
import { LeftMenu } from '../components/LeftMenu/LeftMenu';
import NewsHeader from '../components/News/NewsHeader';
import DiashowList from '../components/Diashow/DiashowList';
import DiashowPreview from '../components/Diashow/DiashowPreview';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import { Modal } from '../components/Layout/Modal';
import Onboarding from '../components/Onboarding/OnboardingContent/Onboarding';
import Preloader from '../components/Preloader';
import useInviteStatus from '../components/News/useInviteStatus';
import OnboardingNotification from '../components/Onboarding/OnboardingContent/OnboardingNotification';
import useRealtivesProfileMe from 'components/Mehr/useRelativesProfileMe';

type CameraResponseLocationState = {
  isSuccess?: 'success' | 'failed';
};

export function DiashowPage() {
  const locationState = useLocation().state as CameraResponseLocationState;
  const [isOnboardingOpened, setIsOnboardingOpened] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    data: inviteStatusData,
    isLoading: isInviteStatusLoading,
    refetch: refetchInviteStatus,
  } = useInviteStatus();
  const { isError, isLoading: isRelativeProfileLoading } = useRealtivesProfileMe();

  const { currentPatientId: patientId } = CurrentPatientConsumer();
  const { data: diashowId } = useDiashowId(patientId!);

  const patient = usePatient(patientId!);

  const [openedId, setOpenedId] = useState<number | undefined>();

  useEffect(() => {
    if (patientId === null || (patientId && !isInviteStatusLoading)) {
      setIsLoaded(true);
    }
  }, [patientId, isInviteStatusLoading]);

  useEffect(() => {
    if (isLoaded) {
      if (!patientId && inviteStatusData && inviteStatusData?.count === 0) {
        setIsOnboardingOpened(true);
      }
      if (patientId) {
        setIsOnboardingOpened(false);
      }
      if (inviteStatusData && inviteStatusData?.count > 0) {
        setIsOnboardingOpened(false);
      }
    }
  }, [patientId, inviteStatusData?.count, isLoaded]);

  const closeOnboarding = () => {
    setIsOnboardingOpened(false);
    refetchInviteStatus();
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

  if (!isLoaded) {
    return (
      <div>
        <Preloader />
      </div>
    );
  }

  return (
    <div>
      <div className="h-screen">
        <Helmet>
          <title>IntensivKontakt – Diashow</title>
        </Helmet>
        <NewsHeader />
        <div className="flex justify-center">
          <div className="bg-int-very-light-grey flex max-w-[1512px] min-w-[600px] w-screen">
            <LeftMenu />
            {patientId && (
              <>
                <div className="w-4/12 p-5 overflow-y-scroll h-[calc(100vh-88px)] ">
                  <DiashowList
                    name={`${patient ? `${patient.first_name} ${patient.last_name}` : ''}`}
                    openedId={openedId}
                    setOpenedId={setOpenedId}
                    patientId={patientId}
                    diashowId={diashowId}
                    cameraUploadStatus={(locationState && locationState?.isSuccess) || undefined}
                  />
                </div>
                <div className="w-7/12 h-[calc(100vh-88px) p-5">
                  <DiashowPreview openedId={openedId} />
                </div>
              </>
            )}
            {!patientId && inviteStatusData && inviteStatusData?.count > 0 && (
              <div className="flex items-center justify-center w-[100%]">
                <OnboardingNotification />
              </div>
            )}
          </div>
        </div>
        {isOnboardingOpened && (
          <Modal closeModal={closeOnboarding} width={700} title={(<b>Patient:in hinzufügen</b>)}>
            <Onboarding closeModal={closeOnboarding} />
          </Modal>
        )}
        <Footer />
      </div>
    </div>
  );
}
