import React, { useState } from 'react';
import OnboardingStartScreen from './OnboardingStartScreen';
import OnboardingPage1 from './OnboardingPage1';
import OnboardingPage2 from './OnboardingPage2';
import OnboardingPage3 from './OnboardingPage3';
import OnboardingPreview from './OnboardingPreview';
import OnboardingNotification from './OnboardingNotification';
import OnboardingPage4 from './OnboardingPage4';
import OnboardingPage5 from './OnboardingPage5';
import { ONBOARDING_PAGES, ONBOARDING_MATCH_STATUSES } from '../../util/constants';
import { IoCompassOutline } from 'react-icons/io5'; 

type OnboardingPropsType = {
  closeModal: () => void;
};

const Onboarding = ({ closeModal }: OnboardingPropsType) => {
  const [onboardingCurrentPage, setOnboardingCurrentPage] = useState(
    {
      page: ONBOARDING_PAGES.START_SCREEN, 
      status: ONBOARDING_MATCH_STATUSES.UNSUCCESSFUL_WITHOUT_TRIES
    }
  );

  switch (onboardingCurrentPage.page) {
    case ONBOARDING_PAGES.START_SCREEN:
      return (
        <OnboardingStartScreen
          setOnboardingCurrentPage={setOnboardingCurrentPage}
          closeModal={closeModal}
          onboardingCurrentPage={onboardingCurrentPage}
        />
      );
    case ONBOARDING_PAGES.HOSPITAL:
      return <OnboardingPage1 
        setOnboardingCurrentPage={setOnboardingCurrentPage} 
        onboardingCurrentPage={onboardingCurrentPage}
      />;
    case ONBOARDING_PAGES.STATION:
      return <OnboardingPage2 
        setOnboardingCurrentPage={setOnboardingCurrentPage}
        onboardingCurrentPage={onboardingCurrentPage}
      />;
    case ONBOARDING_PAGES.BIRTHDAY:
      return <OnboardingPage3 
        setOnboardingCurrentPage={setOnboardingCurrentPage}
        onboardingCurrentPage={onboardingCurrentPage} 
      />;
    case ONBOARDING_PAGES.SERNAME:
      return <OnboardingPage4 
        setOnboardingCurrentPage={setOnboardingCurrentPage}
        onboardingCurrentPage={onboardingCurrentPage} 
      />;
    case ONBOARDING_PAGES.NAME:
      return <OnboardingPage5 
        setOnboardingCurrentPage={setOnboardingCurrentPage}
        onboardingCurrentPage={onboardingCurrentPage} 
      />;
    case ONBOARDING_PAGES.PREVIEW:
      return <OnboardingPreview 
        setOnboardingCurrentPage={setOnboardingCurrentPage}
        onboardingCurrentPage={onboardingCurrentPage} 
      />;
    case ONBOARDING_PAGES.NOTIFICATION:
      return <OnboardingNotification />;
    default:
      return <></>;
  }
};

export default Onboarding;
