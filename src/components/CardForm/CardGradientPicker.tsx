import type { FC } from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import styles from './CardForm.module.css';

const GRADIENT_OPTIONS = [
  { id: 'purple', label: 'Фиолетовый' },
  { id: 'dark', label: 'Графит' },
  { id: 'emerald', label: 'Изумруд' },
  { id: 'sunset', label: 'Закат' },
  { id: 'blue', label: 'Сапфир' },
] as const;

interface CardGradientPickerProps {
  selectedGradient: string;
  onSelect: (gradient: string) => void;
}

export const CardGradientPicker: FC<CardGradientPickerProps> = ({
  selectedGradient,
  onSelect,
}) => {
  return (
    <div className={styles.gradientSelectorRow}>
      <span className={styles.label}>Цвет пластика:</span>
      <div className={styles.gradientSelector}>
        {GRADIENT_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={clsx(
              styles.colorOption,
              styles[id],
              selectedGradient === id && styles.colorOptionSelected,
            )}
            onClick={() => onSelect(id)}
            title={label}
          >
            {selectedGradient === id && (
              <Check size={12} color="#fff" style={{ margin: 'auto' }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
