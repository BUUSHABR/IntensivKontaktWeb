import { useQuery } from 'react-query';
import http from '../util/http';

export interface RelativePatientProfile {
  city: string;
  date_of_admission: string;
  date_of_birth: string;
  first_name: string;
  health_insurance: string;
  house_number: string;
  id: string;
  last_name: string;
  relation: string;
  room: string;
  station: string;
  street: string;
  zip: string;
}

export default function useRelativePatientProfile(currentPatientId: number) {
  return useQuery<RelativePatientProfile, Error>(
    ['relativePatientProfile', currentPatientId],
    () => http.get(`/relatives/relative_patients/${currentPatientId}/patient_profile/`),
    {
      enabled: !!currentPatientId,
    },
  );
}
