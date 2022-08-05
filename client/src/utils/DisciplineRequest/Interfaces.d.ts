import { AxiosResponse } from 'axios';

export interface IStrategy {
  request: () => Promise<AxiosResponse<any>>;
}
