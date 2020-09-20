import * as express from 'express';

export default class CountryState {
  private request;
  private countryList;
  private response;
  private accessKey;
  private baseCurrency;

  constructor(request: express.Request) {
    this.request = request;
    this.response = {};
    this.countryList = new Map<string, CountryList>();
    // Have set the acccess_key as default value for now.
    this.accessKey = 'f8418d9cca82dd3423cfda742c49572e';
    // Have set the base Currency as EUR because it only works with free account
    this.baseCurrency = 'EUR';
  }

  setAccessKey(accessKey: string): void {
    this.accessKey = accessKey;
  }

  setBaseCurrency(baseCurrency: string): void {
    this.baseCurrency = baseCurrency;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setCountryListResponse(countryListResponse: any): void {
    countryListResponse.forEach((country) => {
      this.countryList.set(country.alpha3Code, {
        name: country.name,
        currencies: country.currencies,
        population: country.population,
        currencyCodes: country.currencies.map((currency) => currency.code),
      });
    });
  }

  setCountryExchangeRateResponse(alpha3Code: string, currencies: Currency[]): void {
    const country = this.getCountry(alpha3Code);
    country.currencies = currencies;
    this.countryList.set(alpha3Code, country);

    this.response = Array.from(this.countryList.values());
  }

  setExchangeRatesResponse(exchangeRates: ExchangeRates[]): void {
    this.response = exchangeRates;
  }

  getRequestParams(): any {
    return this.request.query;
  }

  getCountryName(): string {
    return this.request.params.countryName;
  }

  getCountryList(): Map<string, CountryList> {
    return this.countryList;
  }

  getCountry(alpha3Code: string): CountryList {
    return this.countryList.get(alpha3Code);
  }

  getAccessKey(): string {
    return this.accessKey;
  }

  getBaseCurrency(): string {
    return this.baseCurrency;
  }

  getResponse(): any {
    return { result: this.response };
  }
}

interface CountryList {
  name: string;
  currencies: Currency[];
  population: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface ExchangeRates {
  timestamp: Date;
  baseCurrency: string;
  convertedCurrency?: string;
  date: Date;
  rates: number;
  convertedRate: string;
}
