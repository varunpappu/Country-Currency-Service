import * as express from 'express';
import { errors } from '../constants/errors';
import { httpCodes } from '../constants/http-codes';

export default class Controller {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static async execute(executor: any, req: express.Request): Promise<Response> {
    try {
      return await executor(req);
    } catch (err) {
      const statusCode = err.code || httpCodes.InternalServerError;
      const message = err.message || errors.InternalServerError.message;

      const errorInfo = {
        statusCode,
        message,
        source: 'request-error',
      };

      return { statusCode, response: errorInfo };
    }
  }
}

interface Response {
  statusCode: number;
  response: any;
}
