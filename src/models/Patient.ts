export interface IPatient {
  id: number;
  email: string;
  phone: string;
  password: string;
  station: string;
  first_name: string;
  last_name: string;
  managed_stations: [];
}

export interface IPatientCardData {
  bed: string;
  city: string;
  date_of_admission: string;
  date_of_birth: string;
  first_name: string;
  gender: string;
  health_insurance: string;
  last_assets_added: string;
  last_name: string;
  room: string;
  station: string;
  hospital: string;
  street: string;
  zip: string;
}

export interface IChatMessageInfo {
  id: string;
  likes: number;
  text?: string;
  send_at?: string;
  media: {
    id: string;
    link: string;
    type: string;
  };
  duration?: string;
  send_by: number;
}

export interface IFindedPatient {
  date_of_birth: string;
  first_name: string;
  id: number;
  last_name: string;
  station: number;
}

export interface IRelativeSeeActionStatus {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    id: string;
    seen_by_relative: boolean;
    supervisor_confirmed: boolean;
    supervisor_declined: boolean;
  }>;
}
