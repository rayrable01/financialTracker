import type { FC } from 'react';
import { Loader2, Plus, Save, X } from 'lucide-react';
import styles from './CardForm.module.css';

interface CardFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export const CardFormActions: FC<CardFormActionsProps> = ({
  isEditing,
  isSubmitting,
  onCancel,
}) => {
  return (
    <div className={styles.buttonGroup}>
      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Сохранение...</span>
          </>
        ) : isEditing ? (
          <>
            <Save size={16} />
            <span>Сохранить изменения</span>
          </>
        ) : (
          <>
            <Plus size={16} />
            <span>Привязать карту</span>
          </>
        )}
      </button>

      {isEditing && (
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Отмена
        </button>
      )}
    </div>
  );
};
