import React, { useEffect, useMemo, useState } from 'react';
import NewsHeader from '../components/News/NewsHeader';
import Chat from '../components/News/Chat';
import PatientInfo from '../components/News/PatientInfo';
import { Modal } from '../components/Layout/Modal';
import VideoCallModalContent from '../components/News/VideoCallModalContent';
import { useChatId } from '../components/News/useChat';
import http from '../components/util/http';
import { IChatMessageInfo } from '../models/Patient';
import { CHAT_PAGE_SIZE } from '../components/util/constants';
import { LeftMenu } from '../components/LeftMenu/LeftMenu';
import useCallInfo, { useCallStatus } from '../components/News/useCallStatus';
import Onboarding from '../components/Onboarding/OnboardingContent/Onboarding';
import CurrentPatientConsumer from '../components/Mehr/CurrentPatient';
import usePatientCard from '../components/User/usePatientCard';
import Footer from '../components/Footer';
import OnboardingNotification from '../components/Onboarding/OnboardingContent/OnboardingNotification';
import Preloader from '../components/Preloader';
import useInviteStatus from '../components/News/useInviteStatus';
import useRealtivesProfileMe from 'components/Mehr/useRelativesProfileMe';

const NewsPage = () => {
  const [isVideoModal, setIsVideoModal] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<IChatMessageInfo>>([]);
  const [newMessages, setNewMessages] = useState<Array<IChatMessageInfo>>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { currentPatientId } = CurrentPatientConsumer();
  const [showPatientInfo, setShowPatientInfo] = useState<boolean>(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const { isError, isLoading: isRelativeProfileLoading } = useRealtivesProfileMe();

  const {
    data: inviteStatusData,
    isLoading: isInviteStatusLoading,
    refetch: refetchInviteStatus,
  } = useInviteStatus();

  const closeOnboarding = () => {
    setIsOnboardingOpened(false);
    refetchInviteStatus();
  };

  const [isOnboardingOpened, setIsOnboardingOpened] = useState<boolean | undefined>(undefined);
  const { data, isLoading } = usePatientCard(currentPatientId || 0);

  const { data: chatId } = useChatId(currentPatientId!);
  const { data: callInfo } = useCallInfo(currentPatientId!);
  const { data: callStatus } = useCallStatus(callInfo?.id);

  const currentDate = new Date();

  const callDuration = useMemo(() => {
    if (callStatus?.status !== 'inactive' && callStatus) {
      const isoStr = callStatus.creation_time;
      const videoCallStartedDate = new Date(isoStr as string);
      const differenceInMinutes = Math.ceil(
        (currentDate.getTime() - videoCallStartedDate.getTime()) / (1000 * 60),
      );
      return differenceInMinutes;
    }
  }, [callStatus, callStatus?.status, currentDate]);

  const scrollHandler = (e: any) => {
    if (e.target.scrollTop < 3) {
      e.target.scrollTop = 3;
    }

    if (e.target.scrollTop < 300 && messages.length < totalCount) {
      setFetching(true);
    }
  };

  const openVideoModal = () => {
    setIsVideoModal(true);
  };

  const closeVideoModal = () => {
    setIsVideoModal(false);
  };

  useEffect(() => {
    if (chatId && fetching) {
      http
        .get(
          `/patient_chat/chat_messages/${chatId}/?limit=${CHAT_PAGE_SIZE}&offset=${
            currentPage * CHAT_PAGE_SIZE
          }`,
        )
        .then((res) => {
          setTotalCount(res.count);
          setMessages([...res.results.reverse(), ...messages]);
          setCurrentPage((prevState) => prevState + 1);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [chatId, fetching]);

  useEffect(() => {
    if (chatId && messages && !fetching) {
      const interval = setInterval(() => {
        http.get(`/patient_chat/chat_messages/${chatId}/?limit=${CHAT_PAGE_SIZE}`).then((res) => {
          const potentialNewMessages = res.results.reverse();

          const LastCurrentMessagesIdArray = messages.slice(-7).map((m) => {
            return m.id;
          });

          const newUniqueMessages = potentialNewMessages.filter((m: IChatMessageInfo) => {
            return !LastCurrentMessagesIdArray.includes(m.id);
          });

          if (newUniqueMessages.length) {
            setNewMessages(newUniqueMessages);
          }
        });
      }, 20000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [chatId, messages, fetching]);

  useEffect(() => {
    if (currentPatientId === null || (currentPatientId && !isInviteStatusLoading)) {
      setIsLoaded(true);
    }
  }, [currentPatientId, isInviteStatusLoading]);

  useEffect(() => {
    if (isLoaded) {
      if (!currentPatientId && inviteStatusData && inviteStatusData?.count === 0) {
        setIsOnboardingOpened(true);
      }
      if (currentPatientId) {
        setIsOnboardingOpened(false);
      }
      if (inviteStatusData && inviteStatusData?.count > 0) {
        setIsOnboardingOpened(false);
      }
    }
  }, [currentPatientId, inviteStatusData?.count, isLoaded]);

  if ((isError && !isRelativeProfileLoading)) {
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
    <div className="h-screen bg-white">
      <NewsHeader />
      <div className="flex justify-center">
        <div className="flex items-center max-w-[1512px] w-screen">
          <LeftMenu />
          {currentPatientId && (
            <div className="w-[100%] h-[calc(100vh-88px)]">
              <Chat
                openVideoModal={openVideoModal}
                messages={messages}
                newMessages={newMessages}
                scrollHandler={scrollHandler}
                isFetching={fetching}
                isCallGoing={callStatus ? !(callStatus?.status === 'inactive') : false}
                name={` ${
                  data?.first_name && data?.last_name
                    ? `${data?.first_name} ${data?.last_name}`
                    : ''
                }  `}
                setShowPatientInfo={setShowPatientInfo}
              />
            </div>
          )}
          {!currentPatientId && inviteStatusData && inviteStatusData?.count > 0 && (
            <div className="flex items-center justify-center w-[100%]">
              <OnboardingNotification />
            </div>
          )}
          {showPatientInfo && currentPatientId && (
            <div className="min-w-[390px] w-[390px] bg-[#FAFAFA] overflow-auto h-[calc(100vh-88px)]">
              <PatientInfo
                patientId={currentPatientId}
                chatId={chatId}
                data={data!}
                isLoading={isLoading}
                setShowPatientInfo={setShowPatientInfo}
              />
            </div>
          )}
        </div>
      </div>
      {isVideoModal && (
        <Modal
          closeModal={closeVideoModal}
          title={(
            <>
              <div
                className={`rounded-full w-[9px] h-[9px] ${callStatus?.status !== 'inactive' ? 'bg-[#5AAF3C]' : 'bg-int-grey-30'} mr-[6px]`}
              />
              {callStatus?.status !== 'inactive' && (<b>Virtuellerbesuch verfügbar</b>)}
              {callStatus?.status === 'inactive' && (<b>Virtueller Besuch offline</b>)}
            </>
          )}
          subtitle={callStatus?.status !== 'inactive' && (
            <div className="mt-[1px] text-small text-int-dark-blue ml-[16px] mb-[9px]">
              Läuft noch: {callDuration} min.
            </div>
          )}
        >
          <VideoCallModalContent
            isCallGoing={callStatus ? !(callStatus?.status === 'inactive') : false}
            duration={callDuration}
          />
        </Modal>
      )}
      {isOnboardingOpened && (
        <Modal closeModal={closeOnboarding} width={700} title={(<b>Patient:in hinzufügen</b>)}>
          <Onboarding closeModal={closeOnboarding} />
        </Modal>
      )}
      <Footer />
    </div>
  );
};

export default NewsPage;
