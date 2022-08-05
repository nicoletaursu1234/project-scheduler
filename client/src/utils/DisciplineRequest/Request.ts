import { IStrategy } from "./Interfaces";

export default class Request {
  private requestStrategy: IStrategy;

  constructor(type: IStrategy) {
    this.requestStrategy = type;
  }

  public request = async () => {
    return await this.requestStrategy.request();
  };
}

