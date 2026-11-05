import type { FC } from 'react';
import styles from './ToggleCurrencyPolling.module.css';

interface ToggelCurrencyPollingProps {
  liveEnabled: boolean;
  onChangeLive: (live: boolean) => void;
  onChangeDelay: (delay: number) => void;
  delayValue: number;
}

export const ToggelCurrencyPolling: FC<ToggelCurrencyPollingProps> = ({
  liveEnabled,
  onChangeLive,
  onChangeDelay,
  delayValue,
}) => {
  return (
    <form className={styles.toggleForm}>
      <label className={styles.labelInput}>
        <input
          type="checkbox"
          checked={liveEnabled}
          onChange={(e) => onChangeLive(e.target.checked)}
        />
        LIVE Режим
      </label>
      <label className={styles.labelSelect}>
        <select
          id="delay"
          name="delay"
          aria-label=""
          onChange={(e) => {
            onChangeDelay(Number(e.target.value));
          }}
          disabled={!liveEnabled}
          value={delayValue}
        >
          <option value={5000}>5 сек.</option>
          <option value={10000}>10 сек.</option>
          <option value={20000}>20 сек.</option>
        </select>
        Выберите задержку
      </label>
    </form>
  );
};
