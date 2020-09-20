import axios from 'axios';
import { ErroHandler } from '../modules/error-handler';

class Executor {
  static async makeRequest(options) {
    try {
      const response = await axios(options);
      return response;
    } catch (err) {
      throw new ErroHandler(err.response.status, err.response.data.message);
    }
  }
}

export class HttpProxy {
  static async get(url: string, headers = {}): Promise<any> {
    const options = {
      url,
      json: true,
      method: 'GET',
      headers,
    };

    const response = await Executor.makeRequest(options);
    return response;
  }
}
