import React from 'react';
import MainHeader from '../components/Layout/MainHeader';
import { ReactComponent as Logo } from '../assets/logo/logo-success.svg';
import { ReactComponent as ApprovedEmailIcon } from '../assets/icons/approvedEmailIcon.svg';
import { FButton } from '../styles/form';
import { useNavigate } from 'react-router-dom';
import http from '../components/util/http';

const ConfirmedOnboardingPage = () => {
  const navigate = useNavigate();

  const checkNotificationAsSeen = () => {
    http.post(`/contacts/add_relative_responses/mark_responses_seen/`, {}).then((res) => {
      navigate('/news');
    });
  };

  return (
    <div>
      <MainHeader />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-38px)] bg-[#E7E7E7] xl:h-screen">
        <div>
          <Logo />
        </div>
        <div className="mt-[82px] mb-[20px]">
          <ApprovedEmailIcon />
        </div>
        <div className="text-black text-h1">Zuordnung erfolgreich</div>
        <div className="text-black text-body mt-[30px] w-[400px] text-center">
          Die Zuordnung war erfolgreich. Klicken sie auf die Schaltfläche um IntensivKontakt nun im
          vollem Umfang nutzen zu können. Natürlich kostenlos.
        </div>
        <div className="mt-[54px] w-[355px]" onClick={checkNotificationAsSeen}>
          <FButton dark={true}>zu intensivkontakt</FButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmedOnboardingPage;
