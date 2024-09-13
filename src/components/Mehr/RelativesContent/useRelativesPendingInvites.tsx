import { useQuery } from 'react-query';
import http from '../../util/http';

export function useRelativesPendingInvites() {
  return useQuery<any, Error>(['useRelativesPendingInvites'], async () => {
    const res = await http.get(`/auth/users/get_pending_invitations/`);
    return res.results;
  });
}