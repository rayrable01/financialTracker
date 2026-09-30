import type { FC } from 'react';
import { CreditCard } from 'lucide-react';
import type { Card } from '../../types/cards';
import { CardItem } from './CardItem';
import styles from './CardList.module.css';

interface CardListProps {
  cards: Card[];
  loading: boolean;
  editingCardId: string | null;
  deletingCardId: string | null;
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
}

export const CardList: FC<CardListProps> = ({
  cards,
  loading,
  editingCardId,
  deletingCardId,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.listContainer}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Доступные карты</h3>
        <span className={styles.countBadge}>{cards.length} карт</span>
      </div>

      {loading ? (
        <div className={styles.skeletonList}>
          <div className={styles.skeletonItem} />
          <div className={styles.skeletonItem} />
          <div className={styles.skeletonItem} />
        </div>
      ) : cards.length === 0 ? (
        <div className={styles.emptyState}>
          <CreditCard size={40} className={styles.emptyIcon} />
          <div>
            <p className={styles.emptyText}>У вас пока нет привязанных карт</p>
            <p className={styles.emptySubtext}>Заполните форму слева, чтобы добавить первую карту</p>
          </div>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              isEditing={editingCardId === card.id}
              isDeleting={deletingCardId === card.id}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
