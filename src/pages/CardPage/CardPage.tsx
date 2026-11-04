import { CardVisual } from '../../components/CardVisual/CardVisual';
import { CardForm } from '../../components/CardForm/CardForm';
import { CardList } from '../../components/CardList/CardList';
import { FeedbackBanner } from '../../components/FeedbackBanner/FeedbackBanner';
import { TotalBalanceCard } from '../../components/TotalBalanceCard/TotalBalanceCard';
import { ExchangeRatesCard } from '../../components/ExchangeRatesCard/ExchangeRatesCard';
import { useCardManager } from './useCardManager';
import styles from './CardPage.module.css';

export const CardPage = () => {
  const {
    cards,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    deletingId,
    editingCard,
    feedback,
    setFeedback,
    livePreview,
    setLivePreview,
    errorMessage,
    queryError,
    handleFormSubmit,
    handleDeleteCard,
    handleStartEdit,
    handleCancelEdit,
  } = useCardManager();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>Управление картами</h1>
          <p className={styles.pageSubtitle}>
            Привязка карт, мультивалютный баланс по курсу валют и управление счетами
          </p>
        </div>

        <div className={styles.statsRow}>
          <TotalBalanceCard cards={cards} />
          <ExchangeRatesCard />

          {/* Количество карт */}
          <div className={styles.countCard}>
            <span className={styles.statLabel}>Всего карт</span>
            <span className={styles.countValue}>{cards.length}</span>
          </div>
        </div>
      </div>

      {feedback || queryError ? (
        <FeedbackBanner
          type={queryError ? 'error' : feedback!.type}
          message={errorMessage || ''}
          onClose={() => setFeedback(null)}
        />
      ) : null}

      <div className={styles.splitLayout}>
        <section className={styles.formSection}>
          <div className={styles.visualWrapper}>
            <CardVisual
              cardNumber={livePreview.cardNumber}
              cardHolder={livePreview.cardHolder}
              expiryDate={livePreview.expiryDate}
              cardType={livePreview.cardType}
              gradient={livePreview.gradient}
            />
          </div>

          <CardForm
            key={editingCard?.id ?? 'create'}
            initialData={editingCard}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
            isSubmitting={isCreating || isUpdating}
            onLiveChange={setLivePreview}
          />
        </section>

        <section className={styles.listSection}>
          <CardList
            cards={cards}
            loading={isLoading}
            editingCardId={editingCard?.id ?? null}
            deletingCardId={isDeleting ? deletingId : null}
            onEdit={handleStartEdit}
            onDelete={handleDeleteCard}
          />
        </section>
      </div>
    </div>
  );
};
