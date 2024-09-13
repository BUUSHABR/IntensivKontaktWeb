import { useQuery } from 'react-query';
import http from '../../util/http';

export function useRelativesAcceptedInvites() {
  return useQuery<any, Error>(['useRelativesAcceptedInvites'], async () => {
    const res = await http.get(`/auth/users/get_accepted_invitations/`);
    return res.results;
  });
}