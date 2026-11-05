import { type FC, useState } from 'react';
import { useGetExchangeRatesQuery } from '../../api/ratesApi';
import { formatExchangeRateDate } from '../../utils/cardUtils';
import styles from './ExchangeRatesCard.module.css';
import { ToggelCurrencyPolling } from '@/components/ToggleCurrencyPolling/ToggleCurrencyPolling';

export const ExchangeRatesCard: FC = () => {
  const [isLiveEnabled, setIsLiveEnabled] = useState<boolean>(false);
  const [liveDelay, setLiveDelay] = useState<number>(5000);
  const {
    data: exchangeRates,
    isLoading,
    isFetching,
  } = useGetExchangeRatesQuery(undefined, {
    pollingInterval: isLiveEnabled ? liveDelay : 0,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    skipPollingIfUnfocused: true,
    refetchOnReconnect: true,
  });

  const rateDateFormatted = exchangeRates?.date
    ? formatExchangeRateDate(exchangeRates.date)
    : 'сегодня';

  // Техдолг обработать вопросы ?
  return (
    <div className={styles.wrapper}>
      <ToggelCurrencyPolling
        liveEnabled={isLiveEnabled}
        onChangeLive={setIsLiveEnabled}
        onChangeDelay={setLiveDelay}
        delayValue={liveDelay}
      />

      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.label}>Курс ({exchangeRates?.source})</span>
          <span className={styles.date}>
            {isLoading || isFetching ? 'Обновление...' : `на ${rateDateFormatted}`}
          </span>
        </div>

        <div className={styles.values}>
          <div className={styles.badge}>
            <span className={styles.code}>USD</span>
            <span className={styles.rate}>
              {exchangeRates?.rates.USD ? `${exchangeRates?.rates.USD.toFixed(2)} ₽` : '—'}
            </span>
          </div>
          <div className={styles.badge}>
            <span className={styles.code}>EUR</span>
            <span className={styles.rate}>
              {exchangeRates?.rates.EUR ? `${exchangeRates?.rates.EUR.toFixed(2)} ₽` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
