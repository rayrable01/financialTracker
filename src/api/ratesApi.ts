import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ExchangeRatesData } from '../types/currency';

interface CbrValuteItem {
  Value: number;
}

interface CbrDailyResponse {
  Date: string;
  Valute?: {
    USD?: CbrValuteItem;
    EUR?: CbrValuteItem;
  };
}

export const ratesApi = createApi({
  reducerPath: 'ratesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.cbr-xml-daily.ru',
  }),
  endpoints: (builder) => ({
    getExchangeRates: builder.query<ExchangeRatesData, void>({
      query: () => '/daily_json.js',
      transformResponse: (response: CbrDailyResponse): ExchangeRatesData => ({
        date: response.Date,
        rates: {
          RUB: 1,
          USD: Number((response.Valute?.USD?.Value ?? 84.41).toFixed(4)),
          EUR: Number((response.Valute?.EUR?.Value ?? 96.25).toFixed(4)),
        },
        source: 'ЦБ РФ',
      }),
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetExchangeRatesQuery } = ratesApi;
