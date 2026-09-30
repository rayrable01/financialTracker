import { type FC, useMemo } from 'react';
import { useGetExchangeRatesQuery } from '../../api/ratesApi';
import { formatExchangeRateDate } from '../../utils/cardUtils';
import styles from './ExchangeRatesCard.module.css';

export const ExchangeRatesCard: FC = () => {
  const { data: exchangeRates, isLoading } = useGetExchangeRatesQuery();

  const rates = useMemo(
    () => exchangeRates?.rates ?? { RUB: 1, USD: 84.41, EUR: 96.25 },
    [exchangeRates],
  );

  const rateDateFormatted = exchangeRates?.date
    ? formatExchangeRateDate(exchangeRates.date)
    : 'сегодня';

  const rateSource = exchangeRates?.source ?? 'ЦБ РФ';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>Курс ({rateSource})</span>
        <span className={styles.date}>
          {isLoading ? 'Обновление...' : `на ${rateDateFormatted}`}
        </span>
      </div>

      <div className={styles.values}>
        <div className={styles.badge}>
          <span className={styles.code}>USD</span>
          <span className={styles.rate}>{rates.USD ? `${rates.USD.toFixed(2)} ₽` : '—'}</span>
        </div>
        <div className={styles.badge}>
          <span className={styles.code}>EUR</span>
          <span className={styles.rate}>{rates.EUR ? `${rates.EUR.toFixed(2)} ₽` : '—'}</span>
        </div>
      </div>
    </div>
  );
};
