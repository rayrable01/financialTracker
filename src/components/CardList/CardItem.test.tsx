import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { CardItem } from './CardItem';
import type { Card } from '../../types/cards';

const mockCard: Card = {
  id: 'card-123',
  cardNumber: '4111222233334444',
  cardHolder: 'SERGEY KOROLEV',
  expiryDate: '07/28',
  cardType: 'visa',
  balance: 75000,
  currency: 'RUB',
  gradient: 'purple',
  createdAt: '2026-09-30T10:00:00.000Z',
};

describe('Компонент элемента списка карт (CardItem)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('отображает информацию о карте (маскированный номер, держатель, срок, баланс)', () => {
    render(
      <CardItem
        card={mockCard}
        isEditing={false}
        isDeleting={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    // Маскированный номер карты
    expect(screen.getByText('•••• •••• •••• 4444')).toBeInTheDocument();
    // Имя владельца, срок и тип
    expect(screen.getByText('SERGEY KOROLEV')).toBeInTheDocument();
    expect(screen.getByText('07/28')).toBeInTheDocument();
    expect(screen.getByText('visa')).toBeInTheDocument();
    // Отформатированный баланс
    expect(screen.getByText(/75\s?000\s?₽/)).toBeInTheDocument();
  });

  it('вызывает функцию onEdit при нажатии на кнопку редактирования', () => {
    const onEdit = vi.fn();
    render(
      <CardItem
        card={mockCard}
        isEditing={false}
        isDeleting={false}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    const editBtn = screen.getByRole('button', { name: 'Редактировать' });
    act(() => {
      fireEvent.click(editBtn);
    });

    expect(onEdit).toHaveBeenCalledWith(mockCard);
  });

  it('требует двухэтапного подтверждения перед вызовом onDelete', () => {
    const onDelete = vi.fn();
    render(
      <CardItem
        card={mockCard}
        isEditing={false}
        isDeleting={false}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    const deleteBtn = screen.getByRole('button', { name: 'Удалить' });

    // Шаг 1: Первый клик переводит кнопку в режим подтверждения, но не удаляет карту
    act(() => {
      fireEvent.click(deleteBtn);
    });
    expect(onDelete).not.toHaveBeenCalled();
    expect(deleteBtn).toHaveAttribute('title', 'Подтвердить удаление');

    // Шаг 2: Второй клик до истечения таймера запускает удаление
    act(() => {
      fireEvent.click(deleteBtn);
    });
    expect(onDelete).toHaveBeenCalledWith('card-123');
  });

  it('сбрасывает режим подтверждения удаления при отсутствии подтверждения в течение 4 секунд', () => {
    const onDelete = vi.fn();
    render(
      <CardItem
        card={mockCard}
        isEditing={false}
        isDeleting={false}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    const deleteBtn = screen.getByRole('button', { name: 'Удалить' });

    act(() => {
      fireEvent.click(deleteBtn);
    });
    expect(deleteBtn).toHaveAttribute('title', 'Подтвердить удаление');

    // Прокручиваем таймер на 4 секунды вперёд
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(deleteBtn).toHaveAttribute('title', 'Удалить карту');
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('блокирует кнопки редактирования и удаления в процессе удаления (isDeleting = true)', () => {
    render(
      <CardItem
        card={mockCard}
        isEditing={false}
        isDeleting={true}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const editBtn = screen.getByRole('button', { name: 'Редактировать' });
    const deleteBtn = screen.getByRole('button', { name: 'Удалить' });

    expect(editBtn).toBeDisabled();
    expect(deleteBtn).toBeDisabled();
  });
});
