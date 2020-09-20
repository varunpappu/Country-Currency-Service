import * as sinon from 'sinon';
import { expect } from 'chai';

import CountryService from '../../src/server/service/country-service';
import { HttpProxy } from '../../src/server/proxies/http-proxy';

describe('country-info-service', () => {
  function setupCountryResponse(countryResponse) {
    const stub = sinon.stub(HttpProxy, 'get');
    countryResponse.forEach((response, index) => {
      stub.onCall(index).returns(Promise.resolve(response));
    });
  }

  function setupErrorResponse(errorResponse) {
    const stub = sinon.stub(HttpProxy, 'get');
    stub.onCall(0).throws(errorResponse);
  }

  function getRequestInfo(countryName) {
    return {
      headers: {},
      body: {},
      params: {
        countryName,
      },
    };
  }

  afterEach(() => {
    if ((HttpProxy.get as any).restore) {
      (HttpProxy.get as any).restore();
    }
  });

  it('should get country list when country name is provided.', async () => {
    const request = getRequestInfo('India');

    setupCountryResponse([
      {
        data: [
          {
            name: 'India',
            alpha3Code: 'IND',
            population: 1295210000,
            currencies: [
              {
                code: 'INR',
                name: 'Indian rupee',
                symbol: '₹',
              },
            ],
          },
        ],
      },
      {
        data: { success: true, timestamp: 1600494545, base: 'EUR', date: '2020-09-19', rates: { INR: 87.152209 } },
      },
    ]);

    const expectedResponse = {
      statusCode: 200,
      response: {
        result: [
          {
            name: 'India',
            currencies: [
              {
                code: 'INR',
                name: 'Indian rupee',
                symbol: '₹',
                exchangeRate: { timestamp: 1600494545, baseCurrency: 'EUR', date: '2020-09-19', rates: 87.152209 },
              },
            ],
            population: 1295210000,
            currencyCodes: ['INR'],
          },
        ],
      },
    };
    const response = await CountryService.getCountries(request as any);
    expect(response).to.eql(expectedResponse);
  });

  it('should throw when invalid country name is provided.', async () => {
    const request = getRequestInfo('invalidCountry');

    setupErrorResponse([
      {
        statusCode: 404,
        message: 'Not Found',
        source: 'request-error',
      },
    ]);

    try {
      await CountryService.getCountries(request as any);
    } catch (e) {
      expect(e[0].statusCode).to.equal(404);
    }
  });

  it('should gracefully exit when external api connection is unavailable', async () => {
    const request = getRequestInfo('invalidCountry');

    setupErrorResponse([
      {
        statusCode: 404,
        message: 'Internal server Error.',
        source: 'request-error',
      },
    ]);
    try {
      await CountryService.getCountries(request as any);
    } catch (e) {
      expect(e[0].statusCode).to.equal(404);
    }
  });
});
