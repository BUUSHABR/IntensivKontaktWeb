import { useQuery } from 'react-query';
import http from '../util/http';

export function useSuperRelative(currentPatientId: number | undefined) {
  return useQuery<boolean, Error>(
    ['useSuperRelative', currentPatientId],
    () => {
      return http
        .get(`/contacts/patients/${currentPatientId}/patient_super_relative/`)
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    { enabled: !!currentPatientId },
  );
}
