import { useQuery } from 'react-query';
import http from '../../util/http';

export interface AuthUsersMeData {
  id: number;
  email: string;
  phone: string;
  station: number;
  first_name: string;
  last_name: string;
  relation?: string;
}

export default function useAuthUsersMe() {
    return useQuery<AuthUsersMeData, Error>(['authUsersMe'], () => http.get('/auth/users/me/'), {
        retry: false,
    });
}
