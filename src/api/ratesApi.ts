import { exchangeRatesSchema, type ExchangeRatesData } from '../types/currency';
import { baseApi } from '@/api/baseApiConfiguration';

export const ratesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExchangeRates: builder.query<ExchangeRatesData, void>({
      query: () => '/rates',
      transformResponse: (response: unknown) => {
        return exchangeRatesSchema.parse(response);
      },
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetExchangeRatesQuery } = ratesApi;
