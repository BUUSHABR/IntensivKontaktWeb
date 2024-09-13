import React from 'react';
import { useQuery } from 'react-query';
import http from '../../util/http';

type useAssignmentRelativeRequestsType = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    id: string;
    patient: number;
    patient_relation: string;
    user: {
      email: string;
      first_name: string;
      id: number;
      last_name: string;
      phone: string;
    };
  }>;
};

export default function useAssignmentRelativeRequests(currentPatientId: number, superRel: boolean) {
  return useQuery<useAssignmentRelativeRequestsType, Error>(
    ['assignmentRelativeRequests', currentPatientId],
    () => http.get(`/contacts/invitations/${currentPatientId}/get_unconfirmed_invitations/`),

    {
      enabled: !!currentPatientId && !!superRel,
    },
  );
}
