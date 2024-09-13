import React, { useEffect, useState } from 'react';
import OnboardingItemLayout from '../OnboardingItemLayout';
import { FButton } from '../../../styles/form';
import OnboardingConsumer from '../OnboardingProvider';
import { OnboardingPagePropsType } from './OnboardingPage1';
import { ONBOARDING_PAGES, ONBOARDING_MATCH_STATUSES } from '../../util/constants';
import http from '../../util/http';

const OnboardingPage5 = ({ setOnboardingCurrentPage, onboardingCurrentPage }: OnboardingPagePropsType) => {
  const { onboardingValues, setOnboardingValues } = OnboardingConsumer();
  const [error, setError] = useState<string>('');
  const [inputValue, setInputValue] = useState(onboardingValues.patient_first_name || '');

  const navigateToNextStep = () => {
    if (inputValue.length < 3) {
      setError('Die Länge darf nicht weniger als 2 Wörter betragen');
    } else {
      http
        .post('/relatives/relative_onboarding/third_stage_patient_search/', {
          hospital: onboardingValues.hospital.label,
          station: onboardingValues.station.label,
          date_of_birth: onboardingValues.birthday,
          patient_last_name: onboardingValues.patient_last_name,
          patient_first_name: onboardingValues.patient_first_name
        })
        .then((res) => {
          setOnboardingCurrentPage({page: ONBOARDING_PAGES.PREVIEW, status: ONBOARDING_MATCH_STATUSES.SUCCESSFUL});
        })
        .catch((err) => {
          if (err === 'Can`t find any patients with given data.'){
            setOnboardingCurrentPage({page: ONBOARDING_PAGES.PREVIEW, status: ONBOARDING_MATCH_STATUSES.UNSUCCESSFUL_WITH_TRIES});
          }
          else {
            setOnboardingCurrentPage({page: ONBOARDING_PAGES.PREVIEW, status: ONBOARDING_MATCH_STATUSES.UNSUCCESSFUL_WITHOUT_TRIES});
          }
        })
    }
  };

  useEffect(() => {
    if (!onboardingValues.hospital) {
      setOnboardingCurrentPage({ ...onboardingCurrentPage, page: ONBOARDING_PAGES.HOSPITAL});
    }
    if (!onboardingValues.birthday) {
      setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.BIRTHDAY});
    }
    if (!onboardingValues.patient_last_name) {
      setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.SERNAME});
    }
  }, [onboardingValues.hospital, onboardingValues.birthday, onboardingValues.patient_last_name]);

  return (
    <OnboardingItemLayout
      progressWidthPercent={65}
      backLink={() => setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.SERNAME})}
    >
      <div>
        <div className="w-[330px] m-auto">
          <div className="text-h1 font-BeVietnamBold text-black text-center mt-[34px]">
            Wie heißt ihr Angehöriger mit Vornachmen?
          </div>
          <div className="mt-[31px] text-center rounded-[10px] ">
            <input
              onChange={(e) => {
                setOnboardingValues({ ...onboardingValues, patient_first_name: e.target.value })
                setInputValue(e.target.value)
              }}
              type="text"
              className="w-[100%] rounded-[10px] p-[10px] border border-int-mid-blue"
              placeholder="Vorname eingeben"
            />
          </div>

          <div className="text-red-600 text-center h-[30px]">{error && error}</div>

          <div onClick={navigateToNextStep} className="my-[40px]">
            <FButton dark={true}>Fertig</FButton>
          </div>
        </div>
      </div>
    </OnboardingItemLayout>
  );
};

export default OnboardingPage5;
