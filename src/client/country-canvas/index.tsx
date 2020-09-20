import * as React from 'react';
import { Container, Row, Col, FormControl, Form, InputGroup } from 'react-bootstrap';
import { HttpProxy } from '../proxies/http-proxy';
import { CountryInfoViewer } from './table-viewer';
import { URLS } from '../constants/env-constant';

class CountryCanvas extends React.Component<DefaultProps, CountryState> {
  constructor(props: DefaultProps) {
    super(props);
    this.state = {
      countryList: [],
      isRateConverted: false,
      errorMessage: '',
      currencyType: 'EUR',
      conversionAmount: 0,
    };

    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _handleKeyDown = (e: any): void => {
    const { name, value } = e.target;
    if (e.key === 'Enter') {
      if (name === 'countryName') {
        this.fetchCountryList(value);
      }
      if (name === 'conversionRate') {
        this.fetchExchangeRates(value);
      }
    }
    if (name === 'currencyType') {
      this.setState({
        currencyType: value,
      });
    }
  };

  updateCountryList = (newCountryList: CountryList[], existingCountryList: CountryList[]): CountryList[] => {
    return newCountryList
      .filter((newCountry) => {
        if (!existingCountryList.some((existingCountry) => newCountry.name === existingCountry.name)) {
          return newCountry;
        }
      })
      .concat(existingCountryList);
  };

  fetchCountryList = async (countryName: string): Promise<void> => {
    if (!countryName) {
      return;
    }

    const isCountryExist = this.state.countryList.find((country) => country.name === countryName);
    if (isCountryExist) {
      return;
    }

    const url = `${URLS.getCountry}${countryName}`;
    const response: any = await HttpProxy.get(url, {});
    if (response.status === 200) {
      const updatedCountryList = this.updateCountryList(response.data.result, this.state.countryList);

      // Overkill (Why not fetch and update if value is already there?) (BAD :()
      this.state.isRateConverted
        ? await this.fetchExchangeRates(this.state.conversionAmount, updatedCountryList)
        : this.setState({
            countryList: updatedCountryList,
            errorMessage: '',
          });
    } else {
      this.setState({
        errorMessage: response.data.message,
      });
    }
  };

  fetchExchangeRates = async (amount: number, newCountryList?: CountryList[]): Promise<void> => {
    let countryList = this.state.countryList;
    const currencyType = this.state.currencyType;

    if (newCountryList !== undefined) {
      countryList = newCountryList;
    }

    const currencyCodes = countryList.map((country) => country.currencyCodes);
    const url = `${URLS.getConvertedRates}?from=${currencyType}&to=${currencyCodes}&amount=${amount}`;
    const response = await HttpProxy.get(url, {});

    if (response.status === 200) {
      const exchangeRates = response.data.result;
      const updatedCountryList = countryList.map((country) => {
        country.currencies = country.currencies.map((currency) => {
          const updatedCurrencyInfo = exchangeRates.find(
            (exchangeRate) => exchangeRate.convertedCurrency === currency.code
          );
          if (updatedCurrencyInfo) {
            currency.exchangeRate = updatedCurrencyInfo;
          }
          return currency;
        });
        return country;
      });
      this.setState({
        countryList: updatedCountryList,
        isRateConverted: true,
        conversionAmount: amount,
        errorMessage: '',
      });
    } else {
      this.setState({
        errorMessage: response.data.message,
      });
    }
  };

  render(): React.ReactElement {
    return (
      <Container style={{ marginTop: '25px' }}>
        <Row className="justify-content-md-center">
          <Col xs lg="6">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Country Name"
                type="text"
                aria-label="countryName"
                name="countryName"
                onKeyDown={this._handleKeyDown}
              />
            </InputGroup>{' '}
          </Col>
          <Col xs lg="3">
            <InputGroup className="mb-3">
              <FormControl
                disabled={!this.state.countryList.length}
                placeholder="Conversion Amount"
                type="number"
                aria-label="conversionAmount"
                name="conversionRate"
                onKeyDown={this._handleKeyDown}
              />
            </InputGroup>{' '}
          </Col>
          <Col xs lg="3">
            <Form.Group controlId="currencyType">
              <Form.Control
                as="select"
                custom
                name="currencyType"
                disabled={!this.state.countryList.length}
                onChange={this._handleKeyDown}
              >
                <option value="EUR">EUR</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Form.Text className="text-muted">
            {this.state.errorMessage ? <div style={{ color: 'red' }}> {this.state.errorMessage}</div> : null}
          </Form.Text>
        </Row>
        <Row>
          <Col>
            {this.state.countryList.map((country) => (
              <CountryInfoViewer
                key={Math.random()}
                countryName={country.name}
                population={country.population}
                currencies={country.currencies}
                isRateConverted={this.state.isRateConverted}
              />
            ))}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CountryCanvas;

interface CountryState {
  countryList: CountryList[];
  isRateConverted: boolean;
  errorMessage: string;
  conversionAmount: number;
  currencyType: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type DefaultProps = {};

interface CountryList {
  name: string;
  currencies: Currency[];
  population: number;
  currencyCodes: string[];
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: ExchangeRates;
}

interface ExchangeRates {
  timestamp: Date;
  base: string;
  date: Date;
  rates: number;
  convertedRate: number;
}
