import { useQuery } from 'react-query';
import http from '../util/http';

export function useRelativePatients() {
  return useQuery<any, Error>(['useRelativePatients'], async () => {
    const res = await http.get(`/relatives/relative_patients/`);
    return res.results;
  });
}
