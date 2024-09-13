import React, { Dispatch, SetStateAction, useState } from 'react';
import OnboardingItemLayout from '../OnboardingItemLayout';
import Dropdown from '../../DropDown';
import { FButton } from '../../../styles/form';
import OnboardingConsumer from '../OnboardingProvider';

export type OnboardingPageStatusType = {
  page: number;
  status: number;
}

type ChooseRelationPropsType = {
  setOnboardingCurrentPage: Dispatch<SetStateAction<OnboardingPageStatusType>>;
  onLinkRelative: (relativeStatus: string) => void;
  name: string;
  onboardingCurrentPage: OnboardingPageStatusType;
};

const RELATIONS = [
  { label: 'Ehepartner', value: 'Ehepartner' },
  { label: 'Partner:in', value: 'Partner:in' },
  { label: 'Elternteil', value: 'Elternteil' },
  { label: 'Sohn / Tochter', value: 'Sohn / Tochter' },
  { label: 'Schwester / Bruder', value: 'Schwester / Bruder' },
  { label: 'Enkel:in', value: 'Enkel:in' },
  { label: 'Freund:in', value: 'Freund:in' },
  { label: 'andere:r Verwandte:r', value: 'andere:r Verwandte:r' },
  { label: 'Bekannte:r', value: 'Bekannte:r' },
];

const ChooseRelation = ({
  setOnboardingCurrentPage,
  onLinkRelative,
  name,
  onboardingCurrentPage
}: ChooseRelationPropsType) => {
  const [relation, setRelation] = useState<string>('');
  const [error, setError] = useState('');
  const { onboardingValues } = OnboardingConsumer();

  const onChoice = ({ label, value }: { label: string; value: number }) => {
    setRelation(label);
  };

  const onConfirm = () => {
    if (relation) {
      onLinkRelative(relation);
    } else {
      setError(`Geben Sie Ihre Beziehung zu ${name}`);
    }
  };

  return (
    <OnboardingItemLayout
      progressWidthPercent={96}
      backLink={() => setOnboardingCurrentPage({...onboardingCurrentPage , page: onboardingValues.patient_last_name ? 4 : 3})}
    >
      <div>
        <div className="w-[400px] m-auto">
          <div className="mt-[45px] text-h1 font-BeVietnamBold text-black text-center ">
            Geben Sie Ihre Beziehung zu {name} an:
          </div>
          <div className="mt-[35px] text-center rounded-[10px] max-w-[325px] m-auto">
            <Dropdown options={RELATIONS} placeholder={'Beziehung'} onChange={onChoice} />
          </div>
          <div className="text-red-600 text-center mt-[5px] h-[30px]">{error && error}</div>

          <div onClick={onConfirm} className="mt-[46px] mb-[60px] m-auto max-w-[325px]">
            <FButton dark={true}>Weiter</FButton>
          </div>
        </div>
      </div>
    </OnboardingItemLayout>
  );
};

export default ChooseRelation;
