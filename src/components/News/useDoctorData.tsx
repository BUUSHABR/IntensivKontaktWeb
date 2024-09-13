import { useQuery } from 'react-query';
import http from '../util/http';

export interface DoctorData {
  id: string;
  name: string;
  phone: string;
  city: string;
  zip_code: string;
  street: string;
}

export default function useDoctorData(currentPatientId: number) {
  return useQuery<DoctorData, Error>(
    ['doctorData', currentPatientId],
    () => http.get(`/contacts/doctor_data/get_by_patient/${currentPatientId}/`),
    {
      enabled: !!currentPatientId,
    },
  );
}
