import { URLS } from '../constants/env-constants';
import { HttpProxy } from '../proxies/http-proxy';
import RequestState from '../state/country-req-state';
import { ErroHandler } from '../modules/error-handler';
import { httpCodes } from '../constants/http-codes';
import { errors } from '../constants/errors';

export default class FetchCurrencies {
  static async invoke(reqState: RequestState): Promise<void> {
    const accessKey = reqState.getAccessKey();
    const exchangeCurrParams = reqState.getRequestParams();

    const fromCurrency = exchangeCurrParams.from;
    const toCurrencies = exchangeCurrParams.to;

    if (!fromCurrency || !toCurrencies) {
      throw new ErroHandler(httpCodes.BadRequest, errors.InvalidCountryCode.message);
    }

    const conversionAmount = exchangeCurrParams.amount;
    if (isNaN(conversionAmount) || conversionAmount < 0) {
      throw new ErroHandler(httpCodes.BadRequest, errors.NotANumber.message);
    }

    const currencyList = Array.from(new Set(toCurrencies.split(',')));
    const exchangeRates: ExchangeRates[] = await Promise.all(
      currencyList.map(async (currency: string) => {
        const url = `${URLS.getCountryCurrency}${accessKey}&base=${fromCurrency}&symbols=${currency}`;
        const response = await HttpProxy.get(url, {});
        // We get response always; since its a free account success is either true or false
        if (response.data.success) {
          const convertedRate = (response.data.rates[currency] * conversionAmount).toFixed(2);
          return {
            timestamp: response.data.timestamp,
            baseCurrency: response.data.base,
            convertedCurrency: currency,
            date: response.data.date,
            rates: response.data.rates[currency],
            convertedRate,
          };
        } else {
          const errorCode = response.data.error.code;
          if (errorCode === 105) {
            throw new ErroHandler(httpCodes.Forbidden, errors.Forbidden.message);
          }
          throw new ErroHandler(httpCodes.BadRequest, errors.InvalidCurrency.message);
        }
      })
    );
    reqState.setExchangeRatesResponse(exchangeRates);
  }

  static async getExchangeRate(reqState: RequestState): Promise<void> {
    const countryList = reqState.getCountryList();
    const accessKey = reqState.getAccessKey();
    const baseCurrency = reqState.getBaseCurrency();

    const fetchExchangeRate = async (currencyList, currency) => {
      currencyList = await currencyList;
      const url = `${URLS.getCountryCurrency}${accessKey}&base=${baseCurrency}&symbols=${currency.code}`;
      const response = await HttpProxy.get(url, {});
      if (response.data.success) {
        currency.exchangeRate = {
          timestamp: response.data.timestamp,
          baseCurrency: response.data.base,
          date: response.data.date,
          rates: response.data.rates[currency.code],
        };
        currencyList.push(currency);
        return currencyList;
      } else {
        const errorCode = response.data.error.code;
        if (errorCode === 105) {
          throw new ErroHandler(httpCodes.Forbidden, errors.Forbidden.message);
        }
        throw new ErroHandler(httpCodes.BadRequest, errors.InvalidCurrency.message);
      }
    };

    for (const [alpha3Code, country] of countryList.entries()) {
      const currencies = await country.currencies.reduce(fetchExchangeRate, []);
      if (currencies) {
        reqState.setCountryExchangeRateResponse(alpha3Code, currencies);
      }
    }
  }
}
interface ExchangeRates {
  timestamp: Date;
  baseCurrency: string;
  date: Date;
  convertedCurrency?: string;
  rates: number;
  convertedRate: string;
}
