import BootstrapTable from 'react-bootstrap-table-next';
import * as React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

export const CountryInfoViewer = (props: CountryListProps): React.ReactElement => {
  const tableColumns = [
    {
      dataField: 'code',
      text: 'Currency Code',
    },
    {
      dataField: 'name',
      text: 'Currency Name',
    },
    {
      dataField: 'symbol',
      text: 'Currency symbol',
    },
    {
      dataField: 'exchangeRate.rates',
      text: 'Exchange Rate',
    },
    {
      dataField: 'exchangeRate.convertedRate',
      text: 'Conversion Rate',
      hidden: !props.isRateConverted,
    },
  ];
  return (
    <div>
      <h3>Name: {props.countryName}</h3>
      <h3>Population: {props.population}</h3>

      <BootstrapTable keyField="id" data={props.currencies} columns={tableColumns} />
    </div>
  );
};

interface CountryListProps {
  countryName: string;
  population: number;
  currencies: Currency[];
  isRateConverted: boolean;
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
