import axios, { AxiosResponse } from 'axios';
import { IStrategy } from './Interfaces';

export default class GetByDisciplineId implements IStrategy{
  constructor(private readonly id: string) {
    this.id = id;
  }

  public request = async (): Promise<AxiosResponse<any>> => {
    const { data } = await axios.get(
      `http://localhost:8000/discipline/${this.id}`
    );

    return data;
  };
}
