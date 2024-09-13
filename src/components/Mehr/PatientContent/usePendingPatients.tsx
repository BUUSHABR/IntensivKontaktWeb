import { useQuery } from 'react-query';
import http from '../../util/http';

type usePendingPatientsType = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    id: string;
    patient: {
      first_name: string;
      hospital: string;
      id: number;
      last_name: string;
      station: string;
    };
  }>;
};

export default function usePendingPatients() {
    return useQuery<usePendingPatientsType, Error>(
        ['pendingPatients'],
        () => http.get(`/relatives/relative_patients/get_pending_patients/`),
    );
}
