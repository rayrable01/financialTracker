import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardForm } from './useCardForm';
import type { Card } from '../../types/cards';

const mockCard: Card = {
  id: 'card-1',
  cardNumber: '4111 2222 3333 4444',
  cardHolder: 'JOHN DOE',
  expiryDate: '12/28',
  cardType: 'visa',
  balance: 5000,
  currency: 'USD',
  gradient: 'blue',
  createdAt: '2026-09-30T10:00:00.000Z',
};

describe('Хук управления формой карты (useCardForm)', () => {
  it('инициализирует форму значениями по умолчанию в режиме добавления новой карты', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useCardForm({
        isSubmitting: false,
        onSubmit,
      }),
    );

    expect(result.current.isEditing).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors).toEqual({});
  });

  it('заполняет поля данными карты в режиме редактирования и отключает валидацию номера/CVV', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useCardForm({
        initialData: mockCard,
        isSubmitting: false,
        onSubmit,
      }),
    );

    expect(result.current.isEditing).toBe(true);
    expect(result.current.rules.cardNumber).toEqual({});
    expect(result.current.rules.cvv).toEqual({});
  });

  it('вызывает колбэк onLiveChange с предпросмотром данных карты при изменении полей', () => {
    const onLiveChange = vi.fn();
    renderHook(() =>
      useCardForm({
        initialData: mockCard,
        isSubmitting: false,
        onSubmit: vi.fn(),
        onLiveChange,
      }),
    );

    expect(onLiveChange).toHaveBeenCalledWith(
      expect.objectContaining({
        cardNumber: mockCard.cardNumber,
        cardHolder: mockCard.cardHolder,
        expiryDate: mockCard.expiryDate,
        cardType: 'visa',
        gradient: 'blue',
      }),
    );
  });

  describe('Правила валидации полей формы', () => {
    it('проверяет имя владельца карты (только латиница, минимум имя и фамилия)', () => {
      const { result } = renderHook(() =>
        useCardForm({
          isSubmitting: false,
          onSubmit: vi.fn(),
        }),
      );

      const validate = result.current.rules.cardHolder.validate;
      expect(validate('JOHN DOE')).toBe(true);
      expect(typeof validate('ИВАН ИВАНОВ')).toBe('string');
      expect(typeof validate('JOHNDOE')).toBe('string');
    });

    it('валидирует номер карты по алгоритму Луна в режиме добавления', () => {
      const { result } = renderHook(() =>
        useCardForm({
          isSubmitting: false,
          onSubmit: vi.fn(),
        }),
      );

      const validate = result.current.rules.cardNumber.validate;
      expect(typeof validate).toBe('function');
      if (validate) {
        expect(validate('4111111111111111')).toBe(true);
        expect(typeof validate('1234567890123456')).toBe('string');
      }
    });

    it('проверяет формат и длину CVV-кода в режиме добавления карты', () => {
      const { result } = renderHook(() =>
        useCardForm({
          isSubmitting: false,
          onSubmit: vi.fn(),
        }),
      );

      const validate = result.current.rules.cvv.validate;
      expect(typeof validate).toBe('function');
      if (validate) {
        expect(validate('123')).toBe(true);
        expect(typeof validate('12')).toBe('string');
        expect(typeof validate('12345')).toBe('string');
      }
    });

    it('валидирует баланс: разрешает пустое или неотрицательное число, отклоняет отрицательное', () => {
      const { result } = renderHook(() =>
        useCardForm({
          isSubmitting: false,
          onSubmit: vi.fn(),
        }),
      );

      const validate = result.current.rules.balance.validate;
      expect(validate('')).toBe(true);
      expect(validate('100.50')).toBe(true);
      expect(typeof validate('-50')).toBe('string');
    });
  });

  describe('Отправка формы (handleSubmit)', () => {
    it('трансформирует и передаёт CreateCardDto в onSubmit при создании карты', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useCardForm({
          isSubmitting: false,
          onSubmit,
        }),
      );

      await act(async () => {
        result.current.setValue('cardNumber', '4111111111111111');
        result.current.setValue('cardHolder', 'alex smith');
        result.current.setValue('expiryDate', '12/28');
        result.current.setValue('cvv', '789');
        result.current.setValue('balance', '1500');
        result.current.setValue('currency', 'USD');
        result.current.setValue('gradient', 'purple');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(onSubmit).toHaveBeenCalledWith({
        cardNumber: '4111111111111111',
        cardHolder: 'ALEX SMITH',
        expiryDate: '12/28',
        cvv: '789',
        cardType: 'visa',
        balance: 1500,
        currency: 'USD',
        gradient: 'purple',
      });
    });

    it('трансформирует и передаёт UpdateCardDto в onSubmit при редактировании карты', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useCardForm({
          initialData: mockCard,
          isSubmitting: false,
          onSubmit,
        }),
      );

      await act(async () => {
        result.current.setValue('cardHolder', 'john updated');
        result.current.setValue('expiryDate', '11/29');
        result.current.setValue('balance', '2000');
        result.current.setValue('currency', 'EUR');
        result.current.setValue('gradient', 'ocean');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(onSubmit).toHaveBeenCalledWith({
        cardHolder: 'JOHN UPDATED',
        expiryDate: '11/29',
        balance: 2000,
        currency: 'EUR',
        gradient: 'ocean',
      });
    });
  });
});
