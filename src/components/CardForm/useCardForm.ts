import { useForm, useWatch, type SubmitHandler, Controller } from 'react-hook-form';
import cardValidator from 'card-validator';
import { useEffect } from 'react';
import type { Card, CardPreview, CreateCardDto, PaymentSystem, UpdateCardDto } from '../../types/cards';
import { detectCardType } from '../../utils/cardUtils';

export { Controller };

export interface CardFormFields {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  balance: string;
  currency: string;
  gradient: string;
}

interface UseCardFormProps {
  initialData?: Card | null;
  isSubmitting: boolean;
  onSubmit: (data: CreateCardDto | UpdateCardDto) => Promise<void>;
  onLiveChange?: (preview: CardPreview) => void;
}

export const useCardForm = ({ initialData, isSubmitting, onSubmit, onLiveChange }: UseCardFormProps) => {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CardFormFields>({
    defaultValues: initialData
      ? {
          cardNumber: initialData.cardNumber,
          cardHolder: initialData.cardHolder,
          expiryDate: initialData.expiryDate,
          cvv: '',
          balance: String(initialData.balance),
          currency: initialData.currency || 'RUB',
          gradient: initialData.gradient || 'purple',
        }
      : {
          cardNumber: '',
          cardHolder: '',
          expiryDate: '',
          cvv: '',
          balance: '',
          currency: 'RUB',
          gradient: 'purple',
        },
    mode: 'onBlur',
  });

  const watchedCardNumber = useWatch({ control, name: 'cardNumber' });
  const watchedCardHolder = useWatch({ control, name: 'cardHolder' });
  const watchedExpiryDate = useWatch({ control, name: 'expiryDate' });
  const watchedGradient = useWatch({ control, name: 'gradient' });

  // Детект платёжной системы и синхронизация лайв-превью
  useEffect(() => {
    const cardType: PaymentSystem = detectCardType(watchedCardNumber ?? '');
    onLiveChange?.({
      cardNumber: watchedCardNumber ?? '',
      cardHolder: watchedCardHolder ?? '',
      expiryDate: watchedExpiryDate ?? '',
      cardType,
      gradient: watchedGradient ?? 'purple',
    });
  }, [watchedCardNumber, watchedCardHolder, watchedExpiryDate, watchedGradient, onLiveChange]);


  const onValid: SubmitHandler<CardFormFields> = async (data) => {
    if (isEditing) {
      await onSubmit({
        cardHolder: data.cardHolder.trim().toUpperCase(),
        expiryDate: data.expiryDate.trim(),
        balance: data.balance ? Number(data.balance) : 0,
        currency: data.currency,
        gradient: data.gradient,
      } satisfies UpdateCardDto);
    } else {
      await onSubmit({
        cardNumber: data.cardNumber.trim(),
        cardHolder: data.cardHolder.trim().toUpperCase(),
        expiryDate: data.expiryDate.trim(),
        cvv: data.cvv.trim(),
        cardType: detectCardType(data.cardNumber),
        balance: data.balance ? Number(data.balance) : 0,
        currency: data.currency,
        gradient: data.gradient,
      } satisfies CreateCardDto);
    }
  };

  // Правила валидации
  const cardNumberRules = !isEditing
    ? {
        required: 'Введите номер карты',
        validate: (val: string) => {
          const result = cardValidator.number(val.replace(/\s/g, ''));
          return result.isValid || 'Некорректный номер карты (проверьте цифры)';
        },
      }
    : {};

  const cardHolderRules = {
    required: 'Укажите имя владельца карты',
    validate: (val: string) => {
      const trimmed = val.trim();
      const result = cardValidator.cardholderName(trimmed);
      return (
        (result.isValid && /^[A-Za-z]+([ '-][A-Za-z]+)+$/.test(trimmed)) ||
        'Имя и фамилия латиницей (например: IVAN IVANOV)'
      );
    },
  };

  const expiryRules = {
    required: 'Укажите срок',
    validate: (val: string) => {
      const result = cardValidator.expirationDate(val);
      return result.isValid || 'Некорректный или истекший срок (MM/YY)';
    },
  };

  const cvvRules = !isEditing
    ? {
        required: 'Введите CVV',
        validate: (val: string) => {
          const result = cardValidator.cvv(val);
          return result.isValid || 'Неверный CVV код (3-4 цифры)';
        },
      }
    : {};

  const balanceRules = {
    validate: (val: string) => {
      if (!val) return true;
      const num = Number(val);
      return (!isNaN(num) && num >= 0) || 'Баланс не может быть отрицательным';
    },
  };

  return {
    register,
    control,
    errors,
    isEditing,
    isSubmitting,
    setValue,
    handleSubmit: handleSubmit(onValid),
    rules: {
      cardNumber: cardNumberRules,
      cardHolder: cardHolderRules,
      expiryDate: expiryRules,
      cvv: cvvRules,
      balance: balanceRules,
    },
  };
};
