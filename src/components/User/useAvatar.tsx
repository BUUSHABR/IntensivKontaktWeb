import { useQuery } from 'react-query';
import http from './../util/http';

export interface AvatarData {
  avatar: string;
}

export default function useAvatar() {
  return useQuery<AvatarData, Error>(['userAvatar'], () => http.get('/auth/profile_picture/me/'), {
    retry: false,
  });
}
