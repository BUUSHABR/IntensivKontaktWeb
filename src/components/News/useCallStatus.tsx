import React from 'react';
import { useQuery } from 'react-query';
import http from '../util/http';

type useCallInfoResponseType = {
  credentials: {
    jwt_token: string;
    meeting_number: string;
    signature: string;
  };
  host_id: number;
  id: string;
  invited_users: number;
  patient_id: number;
  status: string;
  timer_will_elapse: string;
  users_in_call: number;
};

type useCallStatusResponseType = {
  id: string;
  status: string;
  creation_time: string;
};

export default function useCallInfo(patientId: number) {
  return useQuery<useCallInfoResponseType, Error>(
    ['callInfo', patientId],
    async () => {
      return await http.get(`/meetings/${patientId}/get_by_patient/`);
    },
    {
      enabled: !!patientId,
    },
  );
}
export const useCallStatus = (meetingId: string | undefined) => {
  return useQuery<useCallStatusResponseType, Error>(
    ['callStatus', meetingId],
    async () => {
      return await http.get(`/meetings/${meetingId}/meeting_status/`);
    },
    {
      enabled: !!meetingId,
      refetchInterval: 10000,
    },
  );
};
