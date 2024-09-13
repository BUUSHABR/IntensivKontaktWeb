import React, { useState } from 'react';
import PatientInfoBlock from './PatientInfoBlock';
import medienIcon from '../../assets/icons/medienIcon.svg';
import HauzartIcon from '../../assets/icons/HauzartIcon.svg';
import arrow from '../../assets/icons/chevron.right-gray.svg';
import { ReactComponent as CloseModalIcon } from '../../assets/icons/close-modal.svg';
import { IPatientCardData } from '../../models/Patient';
import { ReactComponent as LeftArrow } from '../../assets/icons/chevron.left.svg';
import MediaInfo from './MediaInfo';
import DoctorInfo from './DoctorInfo';
import { useSuperRelative } from '../Mehr/useSuperRelative';
import CurrentPatientConsumer from '../Mehr/CurrentPatient';

export interface patientInfoProps {
  patientId?: number;
  chatId?: string;
  data: IPatientCardData;
  isLoading: boolean;
  setShowPatientInfo: (a: boolean) => void;
}

const PatientInfo = ({ data, isLoading, setShowPatientInfo }: patientInfoProps) => {
  const { currentPatientId } = CurrentPatientConsumer();
  const { data: superRel } = useSuperRelative(currentPatientId!);

  const [menuItem, setMenuItem] = useState<string>('main');

  return (
    <div className="px-[12px] border-t border-[#ECEFF0] ">
      <div className="relative mt-7 mb-10 flex justify-between items-center">
        {(menuItem !== 'main') ? (
          <div
            className="flex flex-row cursor-pointer"
            onClick={() => setMenuItem('main')}
          >
            <LeftArrow />
            <span className="ml-[10px] text-int-dark-blue">Zurück</span>
          </div>
        ) : <span></span>}

        <h3 className="text-center ">
          {menuItem === 'main' && 'Patient:in'}
          {menuItem === 'media' && `Medien von ${data?.first_name}`}
          {menuItem === 'doctor_info' && 'Versorgungsinformationen'}
        </h3>
        <CloseModalIcon
          className="cursor-pointer"
          onClick={() => setShowPatientInfo(false)}
        />
      </div>

      {menuItem === 'main' && (
        <div>
          <h3 className="font-bold text-[24px] text-int-dark">{`${data?.first_name} ${data?.last_name}`}</h3>
          <PatientInfoBlock data={data} isLoading={isLoading} />

          <div
            className="pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[8px] rounded-[10px] relative before:-z-[1] shadow-resultCard cursor-pointer"
            onClick={() => setMenuItem('media')}
          >
            <div className="flex justify-between flex-wrap gap-5">
              <div className="flex items-center">
                <div className="w-[30px] h-[30px] bg-[#E5E6CC] flex justify-center items-center rounded-[10px] cursor-pointer mr-[12px]">
                  <img src={medienIcon} alt="#" />
                </div>
                <span className="text-int-black">Medien</span>
              </div>
              <div className="flex items-center">
                <span>
                  <img src={arrow} alt="" />
                </span>
              </div>
            </div>
          </div>

          {superRel && ( /* Hidden until integration with KIS is available */
            <div
              className="pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[8px] rounded-[10px] relative before:-z-[1] shadow-resultCard cursor-pointer hidden"
              onClick={() => setMenuItem('doctor_info')}
            >
              <div className="flex justify-between flex-wrap gap-5">
                <div className="flex items-center">
                  <div className="w-[30px] h-[30px] bg-[#D3D9E8] flex justify-center items-center rounded-[10px] cursor-pointer mr-[12px]">
                    <img src={HauzartIcon} alt="#" />
                  </div>
                  <span className="text-int-black">Versorgungsinformationen</span>
                </div>
                <div className="flex items-center">
                  <span>
                    <img src={arrow} alt="" />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {menuItem === 'media' && <MediaInfo />}
      {menuItem === 'doctor_info' && <DoctorInfo patient_full_name = {`${data?.first_name} ${data?.last_name}`}/>}
    </div>
  );
};

export default PatientInfo;
