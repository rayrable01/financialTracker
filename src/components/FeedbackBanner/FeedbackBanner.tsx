import type { FC } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import clsx from 'clsx';
import styles from './FeedbackBanner.module.css';

interface FeedbackBannerProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

export const FeedbackBanner: FC<FeedbackBannerProps> = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div className={clsx(styles.banner, styles[type])}>
      <div className={styles.content}>
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        <span>{message}</span>
      </div>
      {onClose && (
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          <X size={16} />
        </button>
      )}
    </div>
  );
};
