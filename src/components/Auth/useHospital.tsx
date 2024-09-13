import { useQuery } from 'react-query';
import http from 'components/util/http';

interface Hospital {
  id: string;
  name: string;
  logo: string;
  avatar?: string;
}

interface useAllHospitalsResponse {
  count: number;
  next: string;
  previous: string;
  results: Hospital[];
}

export const useAllHospitals = () => {
  return useQuery<useAllHospitalsResponse, Error>(['hospitals'], () =>
    http.get('/contacts/hospitals/'),
  );
};

export default function useHospital(id: string) {
  return useQuery<Hospital, Error>(['hospital', id], () => http.get(`/contacts/hospitals/${id}`));
}
