import { useQuery } from 'react-query';
import http from '../util/http';
import { IPatientCardData } from '../../models/Patient';

export default function usePatientCard(id: number) {
  return useQuery<IPatientCardData, Error>(
    ['patientCard', id],
    () => http.get(`/patient_card/patient_info/${id}/`),
    { enabled: !!id },
  );
}
