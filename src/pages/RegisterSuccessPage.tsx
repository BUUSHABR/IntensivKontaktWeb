import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterCard from '../components/Auth/RegisterCard';
import { ReactComponent as LeftArrow } from '../assets/icons/chevron.left.svg';
import { ReactComponent as SuccessIcon } from '../assets/icons/successIcon.svg';
import { FButton } from '../styles/form';
import GooglePlayIcon from '../assets/icons/googlePlayIcon.png';
import AppStoreIcon from '../assets/icons/appStoreIcon.png';

const RegisterSuccessPage = () => {
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(-1);
  };

  const navigateToStartScreen = () => {
    navigate('/');
  };

  return (
    <RegisterCard
      header={
        <div>
          Wilkommen bei
          <br /> IntensivKontakt
        </div>
      }
    >
      <div onClick={navigateBack} className="absolute top-[30px] left-[30px] cursor-pointer">
        <LeftArrow />
      </div>
      <div className="ml-[25px] mb-[8px]">
        <SuccessIcon />
      </div>
      <div className="text-justify ml-[30px] text-[#000] mb-[18px]">
        Bitte bestätigen Sie ihre E-Mail-
        <br />
        Adresse, um vollständigen Zugang zu <br />
        IntensivKontakt zu erhalten.
      </div>
      <div className="px-[24px] pb-[24px]">
        <FButton onClick={navigateToStartScreen} dark={true}>
          Zurück zu IntensivKontakt
        </FButton>
      </div>
      <div className="w-[358px] bg-[#CBCFD5] m-auto">
        <hr />
      </div>
      <div className="mt-[20px] mb-[19px] text-small w-[300px] justify-center m-auto text-[#000]">
        Hol die IntensivKontakt direkt als App auf dein Smart Phone und verpasse keine Update von
        deinen Liebsten.
      </div>
      <div className="flex justify-center items-center mb-[32px]">
        <img className="mt-[2px] cursor-pointer" src={AppStoreIcon} alt="#" />
        <img className="cursor-pointer" src={GooglePlayIcon} alt="#" />
      </div>
    </RegisterCard>
  );
};

export default RegisterSuccessPage;
