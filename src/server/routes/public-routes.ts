import * as express from 'express';
import CountryController from '../controller/country-controller';
import { limiter } from '../modules/rate-limiter';
import CurrencyConversionController from '../controller/currency-conversion-controller';

export default class PublicRoutes {
  public static register(router: express.Router): void {
    router.use(limiter);
    router.get('/api/v1/country/:countryName', CountryController.getCountries);
    router.get('/api/v1/currency', CurrencyConversionController.getCurrencyConversion);
  }
}
