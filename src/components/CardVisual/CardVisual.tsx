import type { FC } from 'react';
import { CreditCard, Radio } from 'lucide-react';
import clsx from 'clsx';
import type { PaymentSystem } from '../../types/cards';
import styles from './CardVisual.module.css';

interface CardVisualProps {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cardType?: PaymentSystem;
  gradient?: string;
  className?: string;
}

export const CardVisual: FC<CardVisualProps> = ({
  cardNumber = '',
  cardHolder = '',
  expiryDate = '',
  cardType = 'unknown',
  gradient = 'purple',
  className,
}) => {
  // Заполнение плейсхолдера для номера карты
  const formattedNumber = cardNumber.trim() || '•••• •••• •••• ••••';
  const formattedHolder = cardHolder.trim() || 'CARDHOLDER NAME';
  const formattedExpiry = expiryDate.trim() || 'MM/YY';

  const gradientClass = styles[`gradient_${gradient}`] || styles.gradient_purple;

  return (
    <div className={clsx(styles.cardContainer, gradientClass, className)}>
      <div className={styles.topRow}>
        <div className={styles.bankBrand}>
          <CreditCard size={18} />
          <span>YOUNG TRAD.</span>
        </div>

        <div className={styles.systemBadge}>
          {cardType === 'visa' && <span>VISA</span>}
          {cardType === 'mastercard' && (
            <div className={styles.mastercardCircles}>
              <span className={styles.circleRed} />
              <span className={styles.circleYellow} />
            </div>
          )}
          {cardType === 'mir' && <span className={styles.mirBadge}>МИР</span>}
          {cardType === 'unknown' && <span>BANK</span>}
        </div>
      </div>

      <div className={styles.chipRow}>
        <div className={styles.chip} />
        <div className={styles.contactless}>
          <Radio size={20} />
        </div>
      </div>

      <div className={styles.numberRow}>{formattedNumber}</div>

      <div className={styles.bottomRow}>
        <div className={styles.holderCol}>
          <span className={styles.label}>Card Holder</span>
          <span className={styles.value} title={formattedHolder}>
            {formattedHolder}
          </span>
        </div>

        <div className={styles.expiryCol}>
          <span className={styles.label}>Expires</span>
          <span className={clsx(styles.value, styles.expiryValue)}>{formattedExpiry}</span>
        </div>
      </div>
    </div>
  );
};
