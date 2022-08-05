import axios, { AxiosResponse } from 'axios';
import { IStrategy } from './Interfaces';

export default class GetAllGroups implements IStrategy {
  public request = async (): Promise<AxiosResponse<any>> => {
    const { data } = await axios.get(`http://localhost:8000/groups`);

    return data;
  };
}
