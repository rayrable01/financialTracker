import type { FC } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import clsx from 'clsx';
import type { Card, CardPreview, CreateCardDto, UpdateCardDto } from '../../types/cards';
import { useCardForm } from './useCardForm';
import { CardGradientPicker } from './CardGradientPicker';
import { CardFinancialFields } from './CardFinancialFields';
import { CardFormActions } from './CardFormActions';
import styles from './CardForm.module.css';

interface CardFormProps {
  initialData?: Card | null;
  onSubmit: (data: CreateCardDto | UpdateCardDto) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
  onLiveChange?: (preview: CardPreview) => void;
}

export const CardForm: FC<CardFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  onLiveChange,
}) => {
  const {
    register,
    control,
    errors,
    isEditing,
    setValue,
    handleSubmit,
    rules,
  } = useCardForm({ initialData, isSubmitting, onSubmit, onLiveChange });

  const gradient = useWatch({ control, name: 'gradient' });

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.title}>
        {isEditing ? 'Редактировать карту' : 'Добавить новую карту'}
      </h3>

      {/* Выбор цвета пластика */}
      <CardGradientPicker
        selectedGradient={gradient ?? 'purple'}
        onSelect={(id) => setValue('gradient', id, { shouldDirty: true })}
      />

      {/* Номер карты */}
      {!isEditing && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="cardNumber">
            Номер карты
          </label>
          <div className={styles.inputWrapper}>
            <Controller
              name="cardNumber"
              control={control}
              rules={rules.cardNumber}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  id="cardNumber"
                  mask="0000 0000 0000 0000 000"
                  className={clsx(styles.input, errors.cardNumber && styles.inputError)}
                  placeholder="0000 0000 0000 0000"
                  disabled={isSubmitting}
                  autoComplete="cc-number"
                  onAccept={(value) => field.onChange(value)}
                />
              )}
            />
          </div>
          {errors.cardNumber && (
            <span className={styles.errorText}>{errors.cardNumber.message}</span>
          )}
        </div>
      )}

      {/* Владелец карты и Срок */}
      <div className={styles.row}>
        <div className={styles.field} style={{ flex: 2 }}>
          <label className={styles.label} htmlFor="cardHolder">
            Владелец карты
          </label>
          <Controller
            name="cardHolder"
            control={control}
            rules={rules.cardHolder}
            render={({ field }) => (
              <input
                {...field}
                id="cardHolder"
                type="text"
                className={clsx(styles.input, errors.cardHolder && styles.inputError)}
                placeholder="IVAN IVANOV"
                disabled={isSubmitting}
                autoComplete="cc-name"
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />
          {errors.cardHolder && (
            <span className={styles.errorText}>{errors.cardHolder.message}</span>
          )}
        </div>

        <div className={styles.field} style={{ flex: 1 }}>
          <label className={styles.label} htmlFor="expiryDate">
            Срок
          </label>
          <Controller
            name="expiryDate"
            control={control}
            rules={rules.expiryDate}
            render={({ field }) => (
              <IMaskInput
                {...field}
                id="expiryDate"
                mask="00/00"
                className={clsx(styles.input, errors.expiryDate && styles.inputError)}
                placeholder="12/28"
                disabled={isSubmitting}
                autoComplete="cc-exp"
                onAccept={(value) => field.onChange(value)}
              />
            )}
          />
          {errors.expiryDate && (
            <span className={styles.errorText}>{errors.expiryDate.message}</span>
          )}
        </div>
      </div>

      {/* Финансовые поля (CVV, Баланс, Валюта) */}
      <CardFinancialFields
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        control={control}
        errors={errors}
        cvvRules={rules.cvv}
        balanceRules={rules.balance}
        register={register}
      />

      {/* Кнопки действий */}
      <CardFormActions
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};
