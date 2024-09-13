import { useQuery } from 'react-query';
import http from '../util/http';

export function useDiashowId(patientId: number) {
  return useQuery<any, Error>(
    ['useDiashowId', patientId],
    async () => {
      const res = await http.get(`/contacts/diashows/?patient=${patientId}`);
      return res.results[0].id;
    },
    { enabled: !!patientId },
  );
}
