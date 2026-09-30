import { useState, type FC } from 'react';
import { CreditCard, Edit2, Loader2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { Card } from '../../types/cards';
import { formatMoney, maskCardNumber } from '../../utils/cardUtils';
import styles from './CardList.module.css';

interface CardItemProps {
  card: Card;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
}

export const CardItem: FC<CardItemProps> = ({
  card,
  isEditing,
  isDeleting,
  onEdit,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(card.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      // Авто-сброс подтверждения через 4 секунды
      setTimeout(() => setConfirmDelete(false), 4000);
    }
  };

  return (
    <div className={clsx(styles.cardItem, isEditing && styles.activeEditing)}>
      <div className={styles.cardLeft}>
        <div className={clsx(styles.miniVisual, styles[card.gradient] || styles.purple)}>
          <CreditCard size={18} />
        </div>

        <div className={styles.cardInfo}>
          <span className={styles.cardNumber}>{maskCardNumber(card.cardNumber)}</span>
          <div className={styles.cardMeta}>
            <span>{card.cardHolder}</span>
            <span>•</span>
            <span>{card.expiryDate}</span>
            <span>•</span>
            <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{card.cardType}</span>
          </div>
        </div>
      </div>

      <div className={styles.cardRight}>
        <div className={styles.balanceBlock}>
          <span className={styles.balanceLabel}>Баланс</span>
          <span className={styles.balanceAmount}>{formatMoney(card.balance, card.currency)}</span>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => onEdit(card)}
            disabled={isDeleting}
            title="Редактировать карту"
            aria-label="Редактировать"
          >
            <Edit2 size={16} />
          </button>

          <button
            type="button"
            className={clsx(styles.actionBtn, styles.deleteBtn)}
            onClick={handleDeleteClick}
            disabled={isDeleting}
            title={confirmDelete ? 'Подтвердить удаление' : 'Удалить карту'}
            aria-label="Удалить"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} {...(confirmDelete && { color: '#ef4444' })} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
