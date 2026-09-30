import type { FC } from 'react';
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import clsx from 'clsx';
import type { CardFormFields } from './useCardForm';
import styles from './CardForm.module.css';

interface CardFinancialFieldsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  control: Control<CardFormFields>;
  errors: FieldErrors<CardFormFields>;
  cvvRules: object;
  balanceRules: object;
  register: UseFormRegister<CardFormFields>;
}

export const CardFinancialFields: FC<CardFinancialFieldsProps> = ({
  isEditing,
  isSubmitting,
  control,
  errors,
  cvvRules,
  balanceRules,
  register,
}) => {
  return (
    <div className={styles.row}>
      {!isEditing && (
        <div className={styles.field} style={{ flex: 1 }}>
          <label className={styles.label} htmlFor="cvv">
            CVV
          </label>
          <Controller
            name="cvv"
            control={control}
            rules={cvvRules}
            render={({ field }) => (
              <IMaskInput
                {...field}
                id="cvv"
                mask="0000"
                type="password"
                className={clsx(styles.input, errors.cvv && styles.inputError)}
                placeholder="•••"
                disabled={isSubmitting}
                autoComplete="cc-csc"
                onAccept={(value) => field.onChange(value)}
              />
            )}
          />
          {errors.cvv && <span className={styles.errorText}>{errors.cvv.message}</span>}
        </div>
      )}

      <div className={styles.field} style={{ flex: 2 }}>
        <label className={styles.label} htmlFor="balance">
          Баланс
        </label>
        <input
          {...register('balance', balanceRules)}
          id="balance"
          type="number"
          min="0"
          step="100"
          className={clsx(styles.input, errors.balance && styles.inputError)}
          placeholder="0"
          disabled={isSubmitting}
        />
        {errors.balance && <span className={styles.errorText}>{errors.balance.message}</span>}
      </div>

      <div className={styles.field} style={{ flex: 1.2 }}>
        <label className={styles.label} htmlFor="currency">
          Валюта
        </label>
        <select
          {...register('currency')}
          id="currency"
          className={styles.input}
          disabled={isSubmitting}
        >
          <option value="RUB">RUB (₽)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </div>
    </div>
  );
};
