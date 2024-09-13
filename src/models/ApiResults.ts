export interface IApiResults<T> {
  count: number;
  next: string;
  previous: string;
  results: T;
}
