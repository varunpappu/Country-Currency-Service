import * as express from 'express';
import { httpCodes } from '../constants/http-codes';
import CountryReqState from '../state/country-req-state';
import FetchCurrencies from '../steps/fetch-currencies';

export default class CurrencyConversionService {
  public static async getCurrencyConversion(req: express.Request): Promise<Response> {
    const requestState = new CountryReqState(req);

    await FetchCurrencies.invoke(requestState);

    const response = requestState.getResponse();
    return { statusCode: httpCodes.Success, response };
  }
}

interface Response {
  statusCode: number;
  response: any;
}
