import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import OnboardingItemLayout from '../OnboardingItemLayout';
import OnboardingConsumer from '../OnboardingProvider';
import http from '../../util/http';
import { IFindedPatient } from '../../../models/Patient';
import { FButton, FSecondaryButton } from '../../../styles/form';
import { OnboardingPagePropsType } from './OnboardingPage1';
import ChooseRelation from './ChooseRelation';
import { ONBOARDING_PAGES, ONBOARDING_MATCH_STATUSES } from '../../util/constants';
import ToastConsumer from 'hoc/toastProvider';


const OnboardingPreview = ({ setOnboardingCurrentPage, onboardingCurrentPage }: OnboardingPagePropsType, ) => {
  const [navigateBackNumber, setNavigateBackNumber] = useState<number>();
  const { onboardingValues } = OnboardingConsumer();
  const [findedPatient, setFindedPatient] = useState<IFindedPatient>();
  const [loading, setLoading] = useState(false);
  const [isRelativeConfirmed, setIsRelativeConfirmed] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const { toast } = ToastConsumer();

  const onLinkRelative = async (relativeStatus: string) => {
    await http
      .post('/relatives/relative_onboarding/add_to_patient_relative/', {
        patient_id: findedPatient?.id,
        is_super_relative: false,
        patient_relation: relativeStatus,
      })
      .then((res) => {
        setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.NOTIFICATION});
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const onConfirmInformation = () => {
    setIsRelativeConfirmed(true);
  };

  const onRepeatOnboarding = () => {
    setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.START_SCREEN});
  };

  useEffect(() => {
    if (!onboardingValues.hospital && onboardingCurrentPage.status !== ONBOARDING_MATCH_STATUSES.UNSUCCESSFUL_WITHOUT_TRIES) {
      setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.HOSPITAL});
    }
    if (!onboardingValues.birthday && onboardingCurrentPage.status !== ONBOARDING_MATCH_STATUSES.UNSUCCESSFUL_WITHOUT_TRIES) {
      setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.BIRTHDAY});
    }
  }, [onboardingValues.hospital, onboardingValues.birthday]);

  useEffect(() => {
    if (
      onboardingValues.birthday &&
      onboardingValues.hospital &&
      !onboardingValues.patient_last_name &&
      !onboardingValues.patient_first_name
    ) {
      setNavigateBackNumber(ONBOARDING_PAGES.BIRTHDAY);
      setLoading(true);
      if (onboardingCurrentPage.status === ONBOARDING_MATCH_STATUSES.SUCCESSFUL) {
        http
          .post('/relatives/relative_onboarding/first_stage_patient_search/', {
            hospital: onboardingValues.hospital.label,
            station: onboardingValues.station.label,
            date_of_birth: onboardingValues.birthday,
          })
          .then((res: IFindedPatient) => {
            setFindedPatient(res);
          })
          .catch((err) => {
            if (err === 'Can`t find a single patient with given data.') {
              setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.SERNAME});
            }
          })
      }
      setLoading(false);
    }

    if (onboardingValues.patient_last_name && !onboardingValues.patient_first_name) {
      setNavigateBackNumber(ONBOARDING_PAGES.SERNAME);
      setLoading(true);
      if (onboardingCurrentPage.status === ONBOARDING_MATCH_STATUSES.SUCCESSFUL) {
        http
          .post('/relatives/relative_onboarding/second_stage_patient_search/', {
            hospital: onboardingValues.hospital.label,
            station: onboardingValues.station.label,
            date_of_birth: onboardingValues.birthday,
            patient_last_name: onboardingValues.patient_last_name,
          })
          .then((res: IFindedPatient) => {
            setFindedPatient(res);
          })
          .catch((err) => {
            if (err === 'Can`t find a single patient with given data.') {
              setOnboardingCurrentPage({...onboardingCurrentPage, page: ONBOARDING_PAGES.NAME});
            }
          })
      }
      setLoading(false);
    }

    if (onboardingValues.patient_last_name && onboardingValues.patient_first_name) {
      setNavigateBackNumber(ONBOARDING_PAGES.NAME);
      setLoading(true);
      if (onboardingCurrentPage.status === ONBOARDING_MATCH_STATUSES.SUCCESSFUL) {
        http
          .post('/relatives/relative_onboarding/third_stage_patient_search/', {
            hospital: onboardingValues.hospital.label,
            station: onboardingValues.station.label,
            date_of_birth: onboardingValues.birthday,
            patient_last_name: onboardingValues.patient_last_name,
            patient_first_name: onboardingValues.patient_first_name,
          })
          .then((res: IFindedPatient) => {
            setFindedPatient(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
      setLoading(false);
      }
  }, [
    onboardingValues.birthday,
    onboardingValues.hospital,
    onboardingValues.station,
    onboardingValues.patient_last_name,
    onboardingValues.patient_first_name,
  ]);

  if (loading) {
    return (
      <div className="flex flex-col items-center relative rounded-[15px] w-[700px] h-[450px] ">
        <div className="flex h-[100%] items-center justify-center">Herunterladen...</div>
      </div>
    );
  }

  if (isRelativeConfirmed) {
    return (
      <ChooseRelation
        setOnboardingCurrentPage={setOnboardingCurrentPage}
        onLinkRelative={onLinkRelative}
        name={findedPatient ? findedPatient.first_name + ' ' + findedPatient.last_name : 'Patient'}
        onboardingCurrentPage={onboardingCurrentPage}
      />
    );
  }

  return (
    <OnboardingItemLayout
      progressWidthPercent={90}
      backLink={() => setOnboardingCurrentPage({...onboardingCurrentPage, page: navigateBackNumber || ONBOARDING_PAGES.START_SCREEN})}
    >
      <div className="mb-[20px] pt-[20px]">
        <div className="text-h1 font-BeVietnamBold text-black text-center w-[400px] m-auto">
          {findedPatient ? 'Wir konnten Sie zuordnen:' : 'Wir konnten Sie leider nicht zuordnen:'}
        </div>

        {findedPatient && !showContactInfo && (
          <div className="w-[325px] m-auto mt-[35px]">
            <div className="pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] relative before:-z-[1] shadow-resultCard">
              <div className="flex justify-between flex-wrap gap-5">
                <span className="text-int-black">
                  {findedPatient.first_name} {findedPatient.last_name}
                </span>
              </div>
            </div>
            <div className="pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] relative before:-z-[1] shadow-resultCard">
              <div className="flex justify-between flex-wrap gap-5">
                <span className="text-int-black">Geburtsdatum</span>
                <span className="text-int-black">
                  {findedPatient && findedPatient.date_of_birth.split('-').reverse().join('.')}
                </span>
              </div>
            </div>
            <div className="pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] relative before:-z-[1] shadow-resultCard">
              <div className="flex justify-between flex-wrap gap-5">
                <span className="text-int-black">Station</span>
                <span className="text-int-black">{findedPatient.station}</span>
              </div>
            </div>

            <div className="mt-[29px]" onClick={onConfirmInformation}>
              <FButton dark={true}>weiter</FButton>
            </div>
            {onboardingValues.patient_last_name && (
              <div className="mt-[19px]" onClick={() => setShowContactInfo(true)}>
                <FSecondaryButton>Nicht mein:e Patient:in</FSecondaryButton>
              </div>
            )}
          </div>
        )}
        {(!findedPatient || showContactInfo) && (
          <div className="w-[450px] m-auto text-center">
            <div className="text-black text-h3 mt-[20px] mb-[20px]">
              Die eingegebenen Daten konnten keiner Patient:in zugeordnet werden. Bitte überprüfen
              Sie Ihre Eingaben (achten Sie bitte besonders auf die Schreibweise).
            </div>
            <div className="mt-[32px] w-[325px] m-auto" onClick={onRepeatOnboarding}>
              <FSecondaryButton
              disabled={onboardingCurrentPage.status==ONBOARDING_MATCH_STATUSES.UNSUCCESSFUL_WITHOUT_TRIES ? true : false}>
                Daten erneut eingeben
              </FSecondaryButton>
            </div>
            {(onboardingCurrentPage.status==ONBOARDING_MATCH_STATUSES.UNSUCCESSFUL_WITHOUT_TRIES && (
              <div className="text-xs">
                Bitte versuchen Sie es in 24 Stunden erneut.
              </div>
            )
            )}
            <div className="mt-[25px]">
              <div className="text-int-grey-90">
                Sollte das Problem weiterhin auftreten, <br /> kontaktieren Sie uns bitte unter
              </div>

              <div className="text-int-dark-blue mt-[20px]">
                <div>support@intensivkontakt.de</div>
                <div>+49 (40) 524796030</div>
              </div>

              <div className="text-int-grey-90 mt-[20px]">Wir helfen Ihnen gerne weiter.</div>
            </div>
          </div>
        )}
      </div>
    </OnboardingItemLayout>
  );
};

export default OnboardingPreview;
