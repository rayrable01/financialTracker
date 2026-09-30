import { useState } from 'react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { Card, CardPreview, CreateCardDto, UpdateCardDto } from '../../types/cards';
import {
  useGetCardsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} from '../../api/cardsApi';

const EMPTY_PREVIEW: CardPreview = {
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cardType: 'unknown',
  gradient: 'purple',
};

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (isFetchBaseQueryError(err)) {
    const data = err.data as { message?: string } | undefined;
    return data?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};

export const useCardManager = () => {
  const { data: cards = [], isLoading, error: queryError } = useGetCardsQuery();
  const [createCard, { isLoading: isCreating }] = useCreateCardMutation();
  const [updateCard, { isLoading: isUpdating }] = useUpdateCardMutation();
  const [deleteCard, { isLoading: isDeleting }] = useDeleteCardMutation();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [livePreview, setLivePreview] = useState<CardPreview>(EMPTY_PREVIEW);

  const handleFormSubmit = async (data: CreateCardDto | UpdateCardDto) => {
    setFeedback(null);

    try {
      if (editingCard) {
        const updated = await updateCard({
          id: editingCard.id,
          data: data as UpdateCardDto,
        }).unwrap();

        setEditingCard(null);
        setFeedback({
          type: 'success',
          message: `Данные карты •••• ${updated.cardNumber.slice(-4)} успешно обновлены`,
        });
      } else {
        const created = await createCard(data as CreateCardDto).unwrap();
        setFeedback({
          type: 'success',
          message: `Карта •••• ${created.cardNumber.slice(-4)} успешно привязана`,
        });
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: extractErrorMessage(err, 'Произошла ошибка при сохранении карты'),
      });
    }
  };

  const handleDeleteCard = async (id: string) => {
    setDeletingId(id);
    setFeedback(null);

    try {
      await deleteCard(id).unwrap();

      if (editingCard?.id === id) {
        setEditingCard(null);
      }

      setFeedback({ type: 'success', message: 'Карта успешно удалена' });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: extractErrorMessage(err, 'Не удалось удалить карту'),
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (card: Card) => {
    setEditingCard(card);
    setLivePreview({
      cardNumber: card.cardNumber,
      cardHolder: card.cardHolder,
      expiryDate: card.expiryDate,
      cardType: card.cardType,
      gradient: card.gradient,
    });
    setFeedback(null);
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
    setLivePreview(EMPTY_PREVIEW);
  };

  const errorMessage = queryError
    ? 'Не удалось загрузить карты с сервера. Проверьте соединение.'
    : feedback?.message;

  return {
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
  };
};
