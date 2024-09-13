import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ReactComponent as InfoIcon } from '../../../assets/icons/InfoIcon.svg';
import { ReactComponent as Arrow } from '../../../assets/icons/chevron.left.svg';
import { FButton } from '../../../styles/form';
import OnboardingConsumer from '../OnboardingProvider';
import { ONBOARDING_PAGES, ONBOARDING_MATCH_STATUSES } from '../../util/constants';
import useRealtivesProfileMe from '../../Mehr/useRelativesProfileMe';

export type OnboardingPageStatusType = {
  page: number;
  status: number;
}

type OnboardingStartScreenPropsType = {
  onboardingCurrentPage: OnboardingPageStatusType,
  setOnboardingCurrentPage: Dispatch<SetStateAction<OnboardingPageStatusType>>;
  closeModal: () => void;
};

const OnboardingStartScreen = ({
  setOnboardingCurrentPage,
  onboardingCurrentPage,
  closeModal,
}: OnboardingStartScreenPropsType) => {
  const { setOnboardingValues } = OnboardingConsumer();
  const {data: relative_profile} = useRealtivesProfileMe();

  useEffect(() => {
    setOnboardingValues({});
  }, [setOnboardingValues]);

  return (
    <div className="flex items-center justify-center pl-[10px] pr-[10px] relative h-[450px]">
      <div className=" px-[100px] flex flex-col justify-center items-center">
        <div className="pt-[50px] m-auto text-center pb-[40px]">
          <InfoIcon />
        </div>
        <div className="text-h1 text-black pb-[65px] text-center">
          Damit Sie IntensivKontakt News nutzen können, müssen wir Sie Ihrer / Ihrem Angehörigen
          zuorden.
        </div>
        <div className="w-[325px] pb-[70px]" onClick={() => setOnboardingCurrentPage(
          {
            ...onboardingCurrentPage, 
            page: relative_profile?.exceeded_onboarding_quota ? ONBOARDING_PAGES.PREVIEW : ONBOARDING_PAGES.HOSPITAL
          })}>
          <FButton dark={true}>Zu Patienten zuordnen</FButton>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStartScreen;
