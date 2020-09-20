import * as express from 'express';
import { httpCodes } from '../constants/http-codes';
import CountryReqState from '../state/country-req-state';
import FetchCountries from '../steps/fetch-countries';
import FetchCurrencies from '../steps/fetch-currencies';

export default class CountryService {
  public static async getCountries(req: express.Request): Promise<Response> {
    const requestState = new CountryReqState(req);

    await FetchCountries.invoke(requestState);
    await FetchCurrencies.getExchangeRate(requestState);

    const response = requestState.getResponse();
    return { statusCode: httpCodes.Success, response };
  }
}

interface Response {
  statusCode: number;
  response: any;
}
