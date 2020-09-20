import * as express from 'express';
import Controller from './controller';
import CurrencyConversionService from '../service/currency-conversion-service';

export default class CurrencyConversionController {
  public static async getCurrencyConversion(req: express.Request, res: express.Response): Promise<void> {
    const result = await Controller.execute(CurrencyConversionService.getCurrencyConversion, req);
    res.status(result.statusCode).json(result.response);
  }
}
