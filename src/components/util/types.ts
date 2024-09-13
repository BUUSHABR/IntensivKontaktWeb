export type WithChildren<T = {}> = T & { children?: React.ReactNode };

export type Diashow = {
  id: number;
  name: string;
  last_played_at: string;
  patient: number;
  preview_image: string;
};

export type Station = {
  id: number;
  name: string;
};
