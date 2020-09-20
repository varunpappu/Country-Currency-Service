import * as express from 'express';
import CountryService from '../service/country-service';
import Controller from './controller';

export default class CountryController {
  public static async getCountries(req: express.Request, res: express.Response): Promise<void> {
    const result = await Controller.execute(CountryService.getCountries, req);
    res.status(result.statusCode).json(result.response);
  }
}
