import axios from 'axios';

class Executor {
  static async makeRequest(options) {
    try {
      const response = await axios(options);
      return response;
    } catch (err) {
      return err.response;
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
