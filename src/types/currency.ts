export type CurrencyCode = 'RUB' | 'USD' | 'EUR';

export interface ExchangeRatesData {
  date: string;
  rates: {
    RUB: number;
    USD: number;
    EUR: number;
    [key: string]: number;
  };
  source: string;
}
