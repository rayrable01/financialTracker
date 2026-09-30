import { useState, useMemo, type FC } from 'react';
import clsx from 'clsx';
import type { Card } from '../../types/cards';
import type { CurrencyCode } from '../../types/currency';
import { useGetExchangeRatesQuery } from '../../api/ratesApi';
import { convertCurrency, formatMoney } from '../../utils/cardUtils';
import styles from './TotalBalanceCard.module.css';

const CURRENCIES: CurrencyCode[] = ['RUB', 'USD', 'EUR'];

interface TotalBalanceCardProps {
  cards: Card[];
}

export const TotalBalanceCard: FC<TotalBalanceCardProps> = ({ cards }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('RUB');
  const { data: exchangeRates } = useGetExchangeRatesQuery();

  const rates = useMemo(
    () => exchangeRates?.rates ?? { RUB: 1, USD: 84.41, EUR: 96.25 },
    [exchangeRates],
  );

  // Конвертированный общий баланс
  const totalConvertedBalance = useMemo(() => {
    return cards.reduce((sum, card) => {
      const bal = card.balance || 0;
      const curr = card.currency || 'RUB';
      return sum + convertCurrency(bal, curr, selectedCurrency, rates);
    }, 0);
  }, [cards, selectedCurrency, rates]);

  // Номиналы по валютам
  const balancesByCurrency = useMemo(() => {
    const map: Record<string, number> = {};
    cards.forEach((card) => {
      const curr = card.currency || 'RUB';
      map[curr] = (map[curr] || 0) + (card.balance || 0);
    });
    return map;
  }, [cards]);

  const currencyKeys = Object.keys(balancesByCurrency);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>Общий баланс</span>
        <div className={styles.currencyToggle}>
          {CURRENCIES.map((curr) => (
            <button
              key={curr}
              type="button"
              className={clsx(
                styles.currencyBtn,
                selectedCurrency === curr && styles.activeCurrencyBtn,
              )}
              onClick={() => setSelectedCurrency(curr)}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.amount}>
        {formatMoney(totalConvertedBalance, selectedCurrency)}
      </div>

      {currencyKeys.length > 1 && (
        <div className={styles.originalBreakdown}>
          {Object.entries(balancesByCurrency).map(([curr, sum]) => (
            <span key={curr} className={styles.breakdownBadge}>
              {formatMoney(sum, curr)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
