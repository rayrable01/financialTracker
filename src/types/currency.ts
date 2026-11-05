import z from 'zod';

export type CurrencyCode = 'RUB' | 'USD' | 'EUR';

export const exchangeRatesSchema = z.object({
  date: z.union([z.string(), z.number()]).default('--'),
  rates: z
    .object({
      RUB: z.number().default(1),
      USD: z.number().default(0),
      EUR: z.number().default(0),
    })
    .default({ RUB: 1, USD: 0, EUR: 0 }),
  source: z.string().default('ЦБ РФ'),
});

export type ExchangeRatesData = z.infer<typeof exchangeRatesSchema>;
