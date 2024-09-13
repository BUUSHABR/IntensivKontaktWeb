import React, { useEffect, useState } from 'react';
import OnboardingItemLayout from '../OnboardingItemLayout';
import { FButton } from '../../../styles/form';
import OnboardingConsumer from '../OnboardingProvider';
import { OnboardingPagePropsType } from './OnboardingPage1';
import { ONBOARDING_PAGES, ONBOARDING_MATCH_STATUSES } from '../../util/constants';
import http from '../../util/http';
import Preloader from '../../Preloader';

const OnboardingPage3 = (
  { setOnboardingCurrentPage, onboardingCurrentPage }: OnboardingPagePropsType) => {

  const { onboardingValues, setOnboardingValues } = OnboardingConsumer();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!onboardingValues.hospital) {
      setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.HOSPITAL});
    }
  }, [onboardingValues.hospital]);

  const navigateToNextStep = () => {
    if (onboardingValues.birthday) {
      http
        .post('/relatives/relative_onboarding/first_stage_patient_search/', {
          hospital: onboardingValues.hospital.label,
          station: onboardingValues.station.label,
          date_of_birth: onboardingValues.birthday,
        })
        .then((res) => {
          setOnboardingCurrentPage({page: ONBOARDING_PAGES.PREVIEW, status: ONBOARDING_MATCH_STATUSES.SUCCESSFUL});
        })
        .catch((err) => {
          if (err === 'Can`t find a single patient with given data.') {
            setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.SERNAME});
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
    } else {
      setError('Wählen Sie das Geburtsdatum Ihres Verwandten aus');
    }
  };

  return (
    <OnboardingItemLayout
      progressWidthPercent={45}
      backLink={() => setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.STATION})}
    >
      <div>
        <div className="w-[325px] m-auto">
          <div className="text-h1 font-BeVietnamBold text-black text-center mt-[45px]">
            Wann hat Ihr:e Angehörige:r Geburtstag?
          </div>
          <div className="mt-[31px] text-center">
            <input
              onChange={(e) =>
                setOnboardingValues({ ...onboardingValues, birthday: e.target.value })
              }
              type="date"
              value={onboardingValues.birthday || ''}
              className="w-[100%] rounded-[10px] p-[10px] border border-int-mid-blue focus:outline-none focus:border-int-mid-blue"
              min="1900-01-01"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="mt-[20px]"></div>
          <div className="text-center text-red-600 h-[25px]">{error && error}</div>

          <div className="relative">
            <div onClick={navigateToNextStep} className="pt-8 pb-4 m-auto w-[325px]">
              <FButton dark={true}>Weiter</FButton>
            </div>
            <div className="absolute top-[10px] right-0">
              {isLoading && <Preloader small={true} />}
            </div>
          </div>
        </div>
      </div>
    </OnboardingItemLayout>
  );
};

export default OnboardingPage3;
