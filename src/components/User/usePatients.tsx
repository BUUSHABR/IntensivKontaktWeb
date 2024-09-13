import http from 'components/util/http';
import { IApiResults } from 'models/ApiResults';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  hospital: string;
  diashows: Array<number>;
}

interface Diashow {
  id: number;
  name: string;
  patient: number;
  preview_image: string;
  last_played_at: string | null;
  created_at: string;
}

interface PatientWithDiashow extends Patient {
  full_shows?: Array<Diashow>;
}

export function usePatient(id: number) {
  const { data } = usePatients();

  const patient = useMemo(() => {
    if (!data) return undefined;
    for (let i = 0; i < data.length; ++i) {
      if (data[i].id === id) {
        return data[i];
      }
    }
  }, [data]);
  return patient;
}

function usePatients() {
  return useQuery<Array<PatientWithDiashow>, Error>('patients', async () => {
    let patients: Array<PatientWithDiashow> = await http.get('/auth/users/me/patients/');

    if (!patients.find(({ diashows }) => diashows.length)) return patients;

    const { results: diashows }: IApiResults<Array<Diashow>> = await http.get(
      '/contacts/diashows/',
    );
    for (let i = 0; i < patients.length; ++i) {
      const temp = [];
      for (let j = 0; j < diashows.length; ++j) {
        if (patients[i].id === diashows[j].patient) {
          temp.push(diashows[j]);
        }
      }
      if (temp.length) {
        patients[i].full_shows = temp;
      }
    }
    return patients;
  });
}
