import { useQuery } from 'react-query';
import http from './../util/http';

export interface RealtivesProfileMeData {
  active_patient: number;
  city: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  street: string;
  zip_code: string;
  exceeded_onboarding_quota: boolean;
}

export default function useRealtivesProfileMe() {
    return useQuery<RealtivesProfileMeData, Error>(['realtivesProfile'], () => http.get('/relatives/relatives_profile/me/'), {
        retry: false,
    });
}
