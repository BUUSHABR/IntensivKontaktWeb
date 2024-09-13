import React, { useState } from 'react';
import { FButton } from '../../../styles/form';
import OnboardingItemLayout from '../OnboardingItemLayout';
import OnboardingConsumer from '../OnboardingProvider';
import { OnboardingPagePropsType } from './OnboardingPage1';
import { ONBOARDING_PAGES, ONBOARDING_MATCH_STATUSES } from '../../util/constants';
import http from '../../util/http';
import Preloader from '../../Preloader';

const OnboardingPage4 = (
  { setOnboardingCurrentPage, onboardingCurrentPage }: OnboardingPagePropsType) => {
  const { onboardingValues, setOnboardingValues } = OnboardingConsumer();
  const [error, setError] = useState<string>('');
  const [inputValue, setInputValue] = useState(onboardingValues.patient_last_name || '');
  const [isLoading, setIsLoading] = useState(false);

  const navigateToNextStep = () => {
    if (inputValue.length < 3) {
      setError('Einen korrekten Nachname eingeben');
    } else {
      setIsLoading(true);
      http
        .post('/relatives/relative_onboarding/second_stage_patient_search/', {
          hospital: onboardingValues.hospital.label,
          station: onboardingValues.station.label,
          date_of_birth: onboardingValues.birthday,
          patient_last_name: onboardingValues.patient_last_name,
        })
        .then((res) => {
          setOnboardingCurrentPage({page: ONBOARDING_PAGES.PREVIEW, status: ONBOARDING_MATCH_STATUSES.SUCCESSFUL});
        })
        .catch((err) => {
          if (err === 'Can`t find a single patient with given data.') {
            setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.NAME});
          } else {
            if (err === 'Can`t find any patients with given data.'){
              setOnboardingCurrentPage({page: ONBOARDING_PAGES.PREVIEW, status: ONBOARDING_MATCH_STATUSES.UNSUCCESSFUL_WITH_TRIES});
            }
            else {
              setOnboardingCurrentPage({page: ONBOARDING_PAGES.PREVIEW, status: ONBOARDING_MATCH_STATUSES.UNSUCCESSFUL_WITHOUT_TRIES});
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <OnboardingItemLayout
      progressWidthPercent={55}
      backLink={() => setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.BIRTHDAY})}
    >
      <div>
        <div className="w-[330px] m-auto">
          <div className="text-h1 font-BeVietnamBold text-black text-center mt-[34px]">
            Wie heißt ihr Angehöriger mit Nachnachmen?
          </div>

          <div className="mt-[31px] text-center rounded-[10px] ">
            <input
              value={inputValue}
              onChange={(e) => {
                setOnboardingValues({ ...onboardingValues, patient_last_name: e.target.value })
                setInputValue(e.target.value)
              }}
              type="text"
              className="w-[100%] rounded-[10px] p-[10px] border border-int-mid-blue"
              placeholder="Nachname eingeben"
            />
          </div>

          <div className="text-red-600 text-center h-[30px]">{error && error}</div>

          <div className="my-[40px] relative">
            <div onClick={navigateToNextStep}>
              <FButton dark={true}>Weiter</FButton>
            </div>
            <div className="absolute top-[10px] -right-[30px]">
              {isLoading && <Preloader small={true} />}
            </div>
          </div>
        </div>
      </div>
    </OnboardingItemLayout>
  );
};

export default OnboardingPage4;
