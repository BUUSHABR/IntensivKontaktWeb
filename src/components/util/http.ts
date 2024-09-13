import axios, { AxiosRequestConfig } from 'axios';

// todo: find out where you are (staging, production, local and implement a respective url)
const API_URL = process.env.REACT_APP_BACKEND_URL || '';

interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface IPaginationResult {
  count: number;
  next: string;
  prev: string;
  results: Object[];
}

interface IBadRequest {
  response?: {
    data: any;
  };

  request?: {
    data: any;
  };
}

declare global {
  interface Window {
    localStorage: IStorage;
  }

  interface Object {
    entries: Function;
  }
}

class HTTPService {
  token: string;

  constructor(url: string) {
    axios.defaults.baseURL = url;
    axios.defaults.headers.common.Accept = 'application/json';
    this.token = window.localStorage.getItem(STORAGE_KEY) || '';

    if (this.token) {
      this.setAuthHeader(this.token);
    }
  }

  get(url: string, config?: AxiosRequestConfig) {
    return axios
      .get(url, config)
      .then((res) => this.handleSuccess(res))
      .catch(this.handleError);
  }

  post(url: string, data: Object, config?: AxiosRequestConfig) {
    return axios

      .post(url, data, config)

      .then((res) => this.handleSuccess(res))

      .catch(this.handleError);
  }

  put(url: string, data: Object, config?: AxiosRequestConfig) {
    return axios

      .put(url, data, config)

      .then((res) => this.handleSuccess(res))

      .catch(this.handleError);
  }

  patch(url: string, data: Object, config?: AxiosRequestConfig) {
    return axios

      .patch(url, data, config)

      .then((res) => this.handleSuccess(res))

      .catch(this.handleError);
  }

  delete(url: string, data: Object, config?: AxiosRequestConfig) {
    return axios

      .delete(url, config)

      .then((res) => this.handleSuccess(res))

      .catch(this.handleError);
  }

  handleSuccess(response: any) {
    return response.data;
  }

  handleError(error: IBadRequest) {
    const payload = error.response ? error.response.data : error?.request?.data;

    throw payload;
  }

  setAuthHeader(header: string) {
    axios.defaults.headers.common.Authorization = header ? `Bearer ${header}` : '';
    localStorage.setItem(STORAGE_KEY, header);
  }

  removeAuthHeader() {
    axios.defaults.headers.common.Authorization = '';
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const STORAGE_KEY = 'AUTH_TOKEN';

export default new HTTPService(API_URL);
