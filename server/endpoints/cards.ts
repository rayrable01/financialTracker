import { Router, type Request, type Response } from 'express';
import { randomUUID } from 'crypto';
import type { Card, CreateCardDto, UpdateCardDto } from '../../src/types/cards';

export const cardsRouter = Router();

// Стартовые моковые карты
const cardsDatabase: Card[] = [
  {
    id: 'card-1',
    cardNumber: '4532 8921 5410 8821',
    cardHolder: 'IVAN IVANOV',
    expiryDate: '09/28',
    cardType: 'visa',
    balance: 150000,
    currency: 'RUB',
    gradient: 'purple',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'card-2',
    cardNumber: '5412 7512 3490 4490',
    cardHolder: 'IVAN IVANOV',
    expiryDate: '12/27',
    cardType: 'mastercard',
    balance: 1000,
    currency: 'USD',
    gradient: 'blue',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'card-3',
    cardNumber: '2200 4510 9820 3105',
    cardHolder: 'IVAN IVANOV',
    expiryDate: '04/29',
    cardType: 'mir',
    balance: 450,
    currency: 'EUR',
    gradient: 'emerald',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// Небольшая задержка для реалистичности лоадеров
const simulateDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// GET /cards - получить все карты
cardsRouter.get('/cards', async (_req: Request, res: Response<Card[]>) => {
  await simulateDelay();
  res.json(cardsDatabase);
});

// POST /cards - создать новую карту
cardsRouter.post('/cards', async (req: Request, res: Response<Card | { message: string }>) => {
  await simulateDelay(350);
  const { cardNumber, cardHolder, expiryDate, cardType, balance, currency, gradient } = req.body as CreateCardDto;

  if (!cardNumber || !cardHolder || !expiryDate) {
    res.status(400).json({
      message: 'Номер карты, владелец и срок действия обязательны для заполнения',
    });
    return;
  }

  // Проверка на дубликат номера карты (без учета пробелов)
  const normalizedNewNumber = String(cardNumber).replace(/\s+/g, '');
  const isDuplicate = cardsDatabase.some(
    (c) => c.cardNumber.replace(/\s+/g, '') === normalizedNewNumber,
  );

  if (isDuplicate) {
    res.status(409).json({
      message: 'Карта с таким номером уже привязана',
    });
    return;
  }

  const newCard: Card = {
    id: `card-${randomUUID().slice(0, 8)}`,
    cardNumber: String(cardNumber).trim(),
    cardHolder: String(cardHolder).trim().toUpperCase(),
    expiryDate: String(expiryDate).trim(),
    cardType: cardType || 'unknown',
    balance: Number(balance) || 0,
    currency: currency || 'RUB',
    gradient: gradient || 'purple',
    createdAt: new Date().toISOString(),
  };

  cardsDatabase.unshift(newCard);

  res.status(201).json(newCard);
});

// PUT /cards/:id - обновить данные карты
cardsRouter.put('/cards/:id', async (req: Request, res: Response<Card | { message: string }>) => {
  await simulateDelay(300);
  const { id } = req.params;
  const cardIndex = cardsDatabase.findIndex((c) => c.id === id);

  if (cardIndex === -1) {
    res.status(404).json({
      message: 'Карта не найдена',
    });
    return;
  }

  const existingCard = cardsDatabase[cardIndex];
  const { cardHolder, expiryDate, balance, currency, gradient } = req.body as UpdateCardDto;

  const updatedCard: Card = {
    ...existingCard,
    cardHolder: cardHolder ? String(cardHolder).trim().toUpperCase() : existingCard.cardHolder,
    expiryDate: expiryDate ? String(expiryDate).trim() : existingCard.expiryDate,
    balance: balance !== undefined ? Number(balance) : existingCard.balance,
    currency: currency || existingCard.currency,
    gradient: gradient || existingCard.gradient,
  };

  cardsDatabase[cardIndex] = updatedCard;

  res.json(updatedCard);
});

// DELETE /cards/:id - удалить карту
cardsRouter.delete('/cards/:id', async (req: Request, res: Response<Card | { message: string }>) => {
  await simulateDelay(250);
  const { id } = req.params;
  const cardIndex = cardsDatabase.findIndex((c) => c.id === id);

  if (cardIndex === -1) {
    res.status(404).json({
      message: 'Карта не найдена',
    });
    return;
  }

  const [removedCard] = cardsDatabase.splice(cardIndex, 1);

  res.json(removedCard);
});
