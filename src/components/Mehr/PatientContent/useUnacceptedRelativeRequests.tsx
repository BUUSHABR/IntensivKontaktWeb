import { useQuery } from 'react-query';
import http from '../../util/http';

type unacceptedRelativeRequestsType = {
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

export default function useUnacceptedRelativeRequests() {
    return useQuery<unacceptedRelativeRequestsType, Error>(
        ['unacceptedRelativeRequests'],
        () => http.get(`/relatives/relative_patients/get_unaccepted_relative_requests/`),
    );
}
