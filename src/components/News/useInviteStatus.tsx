import React from 'react';
import { useQuery } from 'react-query';
import http from '../util/http';

type useInviteStatusResponseType = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    id: string;
    patient: {
      id: number;
      first_name: string;
      last_name: string;
      hospital: string;
      station: string;
    };
  }>;
};

export default function useInviteStatus() {
  return useQuery<useInviteStatusResponseType, Error>(['inviteStatus'], async () => {
    return await http.get(`/relatives/relative_patients/get_pending_patients/`);
  });
}
