import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardManager } from './useCardManager';
import type { Card } from '../../types/cards';

const mockCards: Card[] = [
  {
    id: 'card-1',
    cardNumber: '4111 2222 3333 4444',
    cardHolder: 'JOHN DOE',
    expiryDate: '12/28',
    cardType: 'visa',
    balance: 5000,
    currency: 'USD',
    gradient: 'purple',
    createdAt: '2026-09-30T10:00:00.000Z',
  },
];

const mockCreateCard = vi.fn();
const mockUpdateCard = vi.fn();
const mockDeleteCard = vi.fn();

let mockUseGetCardsQuery = vi.fn();

vi.mock('../../api/cardsApi', () => ({
  useGetCardsQuery: () => mockUseGetCardsQuery(),
  useCreateCardMutation: () => [mockCreateCard, { isLoading: false }],
  useUpdateCardMutation: () => [mockUpdateCard, { isLoading: false }],
  useDeleteCardMutation: () => [mockDeleteCard, { isLoading: false }],
}));

describe('Хук управления жизненным циклом карт (useCardManager)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGetCardsQuery = vi.fn(() => ({
      data: mockCards,
      isLoading: false,
      error: undefined,
    }));
  });

  it('возвращает список карт и корректные исходные состояния', () => {
    const { result } = renderHook(() => useCardManager());

    expect(result.current.cards).toEqual(mockCards);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.editingCard).toBeNull();
    expect(result.current.feedback).toBeNull();
    expect(result.current.deletingId).toBeNull();
    expect(result.current.livePreview.cardNumber).toBe('');
  });

  it('успешно выполняет привязку новой карты и выводит сообщение об успехе', async () => {
    mockCreateCard.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          ...mockCards[0],
          cardNumber: '4111222233334444',
        }),
    });

    const { result } = renderHook(() => useCardManager());

    await act(async () => {
      await result.current.handleFormSubmit({
        cardNumber: '4111222233334444',
        cardHolder: 'NEW USER',
        expiryDate: '10/29',
        cvv: '123',
        cardType: 'visa',
        balance: 100,
        currency: 'RUB',
        gradient: 'purple',
      });
    });

    expect(result.current.feedback?.type).toBe('success');
    expect(result.current.feedback?.message).toContain('успешно привязана');
  });

  it('успешно обновляет карту и сбрасывает режим редактирования', async () => {
    mockUpdateCard.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          ...mockCards[0],
          cardHolder: 'UPDATED HOLDER',
        }),
    });

    const { result } = renderHook(() => useCardManager());

    act(() => {
      result.current.handleStartEdit(mockCards[0]);
    });
    expect(result.current.editingCard).toEqual(mockCards[0]);
    expect(result.current.livePreview.cardHolder).toBe('JOHN DOE');

    await act(async () => {
      await result.current.handleFormSubmit({
        cardHolder: 'UPDATED HOLDER',
        expiryDate: '12/28',
        balance: 6000,
        currency: 'USD',
        gradient: 'purple',
      });
    });

    expect(result.current.editingCard).toBeNull();
    expect(result.current.feedback?.type).toBe('success');
    expect(result.current.feedback?.message).toContain('успешно обновлены');
  });

  it('выполняет удаление карты и сбрасывает идентификатор удаления', async () => {
    mockDeleteCard.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    const { result } = renderHook(() => useCardManager());

    await act(async () => {
      await result.current.handleDeleteCard('card-1');
    });

    expect(result.current.deletingId).toBeNull();
    expect(result.current.feedback?.type).toBe('success');
    expect(result.current.feedback?.message).toBe('Карта успешно удалена');
  });

  it('обрабатывает ошибку сервера при отправке формы и извлекает текст ошибки', async () => {
    mockCreateCard.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          status: 400,
          data: { message: 'Карта уже привязана' },
        }),
    });

    const { result } = renderHook(() => useCardManager());

    await act(async () => {
      await result.current.handleFormSubmit({
        cardNumber: '4111222233334444',
        cardHolder: 'USER',
        expiryDate: '10/29',
        cvv: '123',
        cardType: 'visa',
        balance: 100,
        currency: 'RUB',
        gradient: 'purple',
      });
    });

    expect(result.current.feedback?.type).toBe('error');
    expect(result.current.feedback?.message).toBe('Карта уже привязана');
  });

  it('отменяет режим редактирования и сбрасывает предпросмотр карты', () => {
    const { result } = renderHook(() => useCardManager());

    act(() => {
      result.current.handleStartEdit(mockCards[0]);
    });
    expect(result.current.editingCard).not.toBeNull();

    act(() => {
      result.current.handleCancelEdit();
    });
    expect(result.current.editingCard).toBeNull();
    expect(result.current.livePreview.cardNumber).toBe('');
  });

  it('предоставляет понятный текст ошибки при ошибке начальной загрузки карт', () => {
    mockUseGetCardsQuery = vi.fn(() => ({
      data: [],
      isLoading: false,
      error: { status: 500 },
    }));

    const { result } = renderHook(() => useCardManager());
    expect(result.current.errorMessage).toContain('Не удалось загрузить карты');
  });
});
