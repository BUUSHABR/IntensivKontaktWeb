import DoctorInfoEditForm from './DoctorInfoEditForm';
import HealthInsuranceEditForm from './HealthInsuranceEditForm';

export interface PatientFullNameProps {
  patient_full_name?: string;
}

const DoctorInfo = ( {patient_full_name} : PatientFullNameProps) => {
  return (
    <>
      <div className="text-[14px] mb-[18px]">
        <span className="text-int-grey-60">
          Hier können Sie die vom Krankenhaus erfassten Daten von {patient_full_name} ändern.
        </span>
        <br />
        <span className="text-[#FF3B30]">
          Achtung: Alle Änderungen werden an das Krankenhaus weitergeleitet und überprüft.
        </span>
      </div>
      <div className="text-int-black">Hausärzt:in</div>
      <DoctorInfoEditForm />
      <HealthInsuranceEditForm />
    </>
  );
};

export default DoctorInfo;
