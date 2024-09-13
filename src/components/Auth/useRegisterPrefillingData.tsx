import { useQuery } from 'react-query';
import http from 'components/util/http';

export interface RegisterPrefillingDataResponse {
  email: string;
  first_name: string;
  last_name: string;
}

export default function useRegisterPrefillingData(inviteId: string | null) {
  return useQuery<RegisterPrefillingDataResponse, Error>(
    ['prefilling_register', inviteId],
    () => {
      return http.get(`/auth/users/get_invitation_data/?invite_code=${inviteId}`);
    },
    { enabled: !!inviteId, retry: 0, refetchOnWindowFocus: false },
  );
}
