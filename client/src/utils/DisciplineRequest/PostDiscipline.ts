import axios, { AxiosResponse } from 'axios';
import { ICreateDisciplineBody } from 'pages/SchedulePage/types';
import { IStrategy } from './Interfaces';

export default class PostDiscipline implements IStrategy {
  constructor(private readonly payload: ICreateDisciplineBody) {
    this.payload = payload;
  }

  public request = async (): Promise<AxiosResponse<any>> => {
    const { data } = await axios.post(
      `http://localhost:8000/schedule`,
      this.payload
    );

    return data;
  };
}
