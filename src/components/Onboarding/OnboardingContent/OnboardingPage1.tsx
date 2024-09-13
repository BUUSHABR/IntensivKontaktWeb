import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import OnboardingItemLayout from '../OnboardingItemLayout';
import { FButton } from '../../../styles/form';
import { useAllHospitals } from '../../Auth/useHospital';

import OnboardingConsumer from '../OnboardingProvider';
import SearchDropDown from '../../SearchDropDown';
import { ONBOARDING_PAGES } from '../../util/constants';

export type OnboardingPageStatusType = {
  page: number;
  status: number;
}

export type OnboardingPagePropsType = {
  setOnboardingCurrentPage: Dispatch<SetStateAction<OnboardingPageStatusType>>;
  onboardingCurrentPage: OnboardingPageStatusType;
};

const OnboardingPage1 = ({ setOnboardingCurrentPage, onboardingCurrentPage }: OnboardingPagePropsType) => {
  const { data: hospitals } = useAllHospitals();
  const { onboardingValues, setOnboardingValues } = OnboardingConsumer();
  const [error, setError] = useState<string>('');
  const [isSearchText, setIsSearchText] = useState(false);

  const optionsHospitals = useMemo(() => {
    if (!hospitals) return [{ label: '', value: '' }];
    return hospitals.results.map(({ id, name }) => ({ label: name, value: id }));
  }, [hospitals]);

  const navigateToNextStep = () => {
    if (isSearchText) {
      setError('Wählen Sie ein Krankenhaus aus');
    } else {
      if (
        onboardingValues.hospital &&
        onboardingValues.hospital.value &&
        onboardingValues.hospital.label
      ) {
        setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.STATION});
      } else {
        setError('Wählen Sie ein Krankenhaus aus');
      }
    }
  };

  const setChosenOptionToOnboardingValues = ({
    label,
    value,
  }: {
    label: string;
    value: number;
  }) => {
    setOnboardingValues({ ...onboardingValues, hospital: { label: label, value: value } });
  };

  return (
    <OnboardingItemLayout
      progressWidthPercent={15}
      backLink={() => setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.START_SCREEN})}
    >
      <div>
        <div className="w-[400px] m-auto">
          <div className="pt-[45px] text-h1 font-BeVietnamBold text-black text-center ">
            In welchem Krankenhaus ist Ihr:e Angehörige:r stationiert?
          </div>
          <div className="pt-[35px] text-center rounded-[10px] max-w-[325px] m-auto">
            <SearchDropDown
              options={optionsHospitals}
              placeholder={
                (onboardingValues.hospital && onboardingValues.hospital.label) || 'Krankenhaus'
              }
              onChange={setChosenOptionToOnboardingValues}
              setIsSearchText={setIsSearchText}
            />
          </div>
          <div className="text-red-600 text-center pt-[5px] h-[30px]">{error && error}</div>

          <div onClick={navigateToNextStep} className="pt-8 pb-4 m-auto max-w-[325px]">
            <FButton dark={true}>Weiter</FButton>
          </div>
        </div>
      </div>
    </OnboardingItemLayout>
  );
};

export default OnboardingPage1;
