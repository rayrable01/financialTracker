import { Router, type Request, type Response } from 'express';
import { simulateDelay } from '../../src/utils/helpers';

import { type ExchangeRatesData } from '../../src/types/currency';

export const ratesRouter = Router();

const applyFluctuation = (baseRate: number, maxPercent = 0.1): number => {
  // Случайный множитель от -maxPercent до +maxPercent
  const delta = (Math.random() * 2 - 1) * maxPercent;
  return Number((baseRate * (1 + delta)).toFixed(2));
};

const getExchangeRatesMockData = (): ExchangeRatesData => ({
  date: Date.now(),
  rates: {
    RUB: applyFluctuation(70.0),
    USD: applyFluctuation(100.0),
    EUR: applyFluctuation(20.0),
  },
  source: 'ЦБ РФ',
});

// GET /rates - получить курс
ratesRouter.get('/rates', async (_req: Request, res: Response<ExchangeRatesData>) => {
  await simulateDelay();
  res.json(getExchangeRatesMockData());
});
