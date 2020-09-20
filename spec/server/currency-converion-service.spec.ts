import * as sinon from 'sinon';
import { expect } from 'chai';

import CurrencyConversionService from '../../src/server/service/currency-conversion-service';
import { HttpProxy } from '../../src/server/proxies/http-proxy';

describe('currency-conversion-service', () => {
  function setupExchangeRateResponse(countryResponse) {
    const stub = sinon.stub(HttpProxy, 'get');
    countryResponse.forEach((response, index) => {
      stub.onCall(index).returns(Promise.resolve(response));
    });
  }

  function getRequestInfo(exchangeInfo) {
    return {
      headers: {},
      body: {},
      query: {
        from: exchangeInfo.from,
        to: exchangeInfo.to,
        amount: exchangeInfo.amount,
      },
    };
  }
  afterEach(() => {
    if ((HttpProxy.get as any).restore) {
      (HttpProxy.get as any).restore();
    }
  });

  it('should get the exchange amount of the given currency', async () => {
    const request = getRequestInfo({
      from: 'EUR',
      to: 'INR',
      amount: 20,
    });

    setupExchangeRateResponse([
      {
        data: { success: true, timestamp: 1600494545, base: 'EUR', date: '2020-09-19', rates: { INR: 87.152209 } },
      },
    ]);

    const expectedResponse = {
      statusCode: 200,
      response: {
        result: [
          {
            timestamp: 1600494545,
            baseCurrency: 'EUR',
            convertedCurrency: 'INR',
            date: '2020-09-19',
            rates: 87.152209,
            convertedRate: '1743.04',
          },
        ],
      },
    };
    const response = await CurrencyConversionService.getCurrencyConversion(request as any);
    expect(response).to.eql(expectedResponse);
  });

  it('should throw  when invalid currency Code is provided', async () => {
    const request = getRequestInfo({
      from: 'MOR',
      to: 'RRR',
      amount: 20,
    });

    setupExchangeRateResponse([
      {
        data: { success: false, error: { code: 201, type: 'invalid_base_currency' } },
      },
    ]);
    try {
      await CurrencyConversionService.getCurrencyConversion(request as any);
    } catch (e) {
      expect(e.code).to.equal(400);
      expect(e.message).to.equal('Invalid currency code provided');
    }
  });

  it('should throw  when invalid amount is provided', async () => {
    const request = getRequestInfo({
      from: 'MOR',
      to: 'RRR',
      amount: 'twenty',
    });

    try {
      await CurrencyConversionService.getCurrencyConversion(request as any);
    } catch (e) {
      expect(e.code).to.equal(400);
      expect(e.message).to.equal('The value is not a valid number');
    }
  });
});
