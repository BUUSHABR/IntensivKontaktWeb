import React from 'react';
import MainHeader from '../components/Layout/MainHeader';
import { ReactComponent as Logo } from '../assets/logo/logo-success.svg';
import { ReactComponent as DeclineOnboardingMan } from '../assets/icons/declineOnboardingMan.svg';
import { ReactComponent as DeclineOnboardingX } from '../assets/icons/declineOnboardingX.svg';
import { FButton } from '../styles/form';
import { useNavigate } from 'react-router-dom';
import http from '../components/util/http';

const DeclinedOnboardingPage = () => {
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
        <div className="mt-[82px] mb-[20px] relative">
          <DeclineOnboardingMan />
          <div className="absolute -right-[20px] top-0">
            <DeclineOnboardingX />
          </div>
        </div>
        <div className="text-black text-h1">Zuordnung nicht erfolgreich</div>
        <div className="text-black text-body mt-[30px] w-[400px] text-center">
          Die Zuordnung war leider nicht erfolgreich. Ihr:e Angehörige:r im Krankenhaus oder
          sein/ihr nächste:r Angehörige:r hat die Zuordnung leider abgelehnt. Sollten Sie der
          Meinung sein, dass das ein Versehen war, setzen Sie sich bitte mit dem Krankenhaus oder
          dem IntensivKontakt Support in Verbindung.
        </div>
        <div className="mt-[54px] w-[355px]" onClick={checkNotificationAsSeen}>
          <FButton dark={true}>zu intensivkontakt</FButton>
        </div>
      </div>
    </div>
  );
};

export default DeclinedOnboardingPage;
