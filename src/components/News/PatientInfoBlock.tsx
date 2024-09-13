import React from 'react';
import { IPatientCardData } from '../../models/Patient';

interface PatientInfoProps {
  data?: IPatientCardData;
  isLoading: boolean;
}

const PatientInfoBlock = ({ data }: PatientInfoProps) => {

  const patientInfoBlockData = {
    "Krankenhaus": data?.hospital,
    "Station": data?.station,
    "Zimmer": data?.room,
    "Aufgenommen am": data?.date_of_admission && data.date_of_admission.split('-').reverse().join('.'),
    "Geburtsdatum": data?.date_of_birth && data.date_of_birth.split('-').reverse().join('.')
  }

  return (
    <>
      <div className="pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] relative before:-z-[1] shadow-resultCard">
        {patientInfoBlockData && Object.entries(patientInfoBlockData).map(([row_name, row_value], index) =>(
          <div>
            <div className={`flex justify-between ${index === 0 ? "" : "mt-[10px]"} flex-wrap gap-x-5`}>
              <span className="text-int-black">{row_name}</span>
              <span>{row_value}</span>
            </div>
            {index !== Object.keys(patientInfoBlockData).length - 1 &&
              <hr className="mt-[11px] mr-[-15px] border-int-light-blue" />
            }
          </div>
        ))}
      </div>
    </>
  );
};

export default PatientInfoBlock;
