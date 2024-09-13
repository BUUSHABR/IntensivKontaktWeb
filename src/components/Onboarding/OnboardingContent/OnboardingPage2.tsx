import React, { useEffect, useMemo, useState } from 'react';
import OnboardingItemLayout from '../OnboardingItemLayout';
import { FButton } from '../../../styles/form';
import useHospitalStations from '../useHospitalStations';
import OnboardingConsumer from '../OnboardingProvider';
import { OnboardingPagePropsType } from './OnboardingPage1';
import SearchDropDown from '../../SearchDropDown';
import { ONBOARDING_PAGES } from '../../util/constants';

const OnboardingPage2 = ({ setOnboardingCurrentPage, onboardingCurrentPage }: OnboardingPagePropsType) => {
  const { onboardingValues, setOnboardingValues } = OnboardingConsumer();
  const { data: stations } = useHospitalStations(
    onboardingValues.hospital && onboardingValues.hospital.label,
  );
  const [error, setError] = useState<string>('');
  const [isSearchText, setIsSearchText] = useState(false);

  const optionsStation = useMemo(() => {
    if (!stations) return [{ label: '', value: '' }];
    return stations.map(({ id, name }) => ({ label: name, value: id }));
  }, [stations]);

  const setChosenOptionToOnboardingValues = ({
    label,
    value,
  }: {
    label: string;
    value: number;
  }) => {
    setOnboardingValues({ ...onboardingValues, station: { label: label, value: value } });
  };

  useEffect(() => {
    if (!onboardingValues.hospital) {
      setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.HOSPITAL});
    }
  }, [onboardingValues.hospital]);

  const navigateToNextStep = () => {
    if (isSearchText) {
      setError('Wählen Sie eine Station aus oder überspringen Sie dieses Feld');
    } else {
      if (
        onboardingValues.station &&
        onboardingValues.station.value &&
        onboardingValues.station.label
      ) {
        setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.BIRTHDAY});
      } else {
        setError('Wählen Sie eine Station aus oder überspringen Sie dieses Feld');
      }
    }
  };

  const skipStation = () => {
    setOnboardingValues({ ...onboardingValues, station: { label: '', value: '' } });
    setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.BIRTHDAY});
  };

  return (
    <OnboardingItemLayout
      progressWidthPercent={30}
      backLink={() => setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.HOSPITAL})}
    >
      <div className="mt-[45px] flex flex-col items-center">
        <div className="text-h1 font-BeVietnamBold text-black text-center w-[400px] m-auto">
          Auf welcher Station liegt Ihr:e Angehörige:r?
        </div>
        <div className="pt-[31px] text-center rounded-[10px] w-[325px] m-auto">
          <SearchDropDown
            options={optionsStation}
            placeholder={(onboardingValues.station && onboardingValues.station.label) || 'Station'}
            onChange={setChosenOptionToOnboardingValues}
            setIsSearchText={setIsSearchText}
          />
        </div>
        {error &&
        <div className="text-red-600 text-center pt-[5px] h-[30px]">{error && error}</div>
        }
        <div onClick={navigateToNextStep} className="pt-8 pb-4 w-[325px] m-auto">
          <FButton dark={true}>Weiter</FButton>
        </div>
        <div
            onClick={skipStation}
            className="text-end pt-[20px] text-[#6F7782] text-body-small cursor-pointer text-[11px]"
          >
            Überspringen
          </div>
      </div>
    </OnboardingItemLayout>
  );
};

export default OnboardingPage2;
