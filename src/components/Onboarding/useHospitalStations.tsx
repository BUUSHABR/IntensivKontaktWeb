import { useQuery } from 'react-query';
import http from '../util/http';
import { Station } from '../util/types';

export default function useHospitalStations(hospitalName: string) {
  return useQuery<Station[], Error>(
    ['hospital', hospitalName],
    () => {
      return http.get(`/contacts/hospitals/get_hospital_stations/?hospital=${hospitalName}`);
    },
    { enabled: !!hospitalName },
  );
}
