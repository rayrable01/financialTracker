import cardValidator from 'card-validator';
import type { PaymentSystem } from '../types/cards';

/**
 * Определение платежной системы через card-validator
 */
export const detectCardType = (cardNumber: string): PaymentSystem => {
  const validation = cardValidator.number(cardNumber);
  const type = validation.card?.type;

  switch (type) {
    case 'visa':
      return 'visa';
    case 'mastercard':
      return 'mastercard';
    case 'mir':
      return 'mir';
    default:
      return 'unknown';
  }
};

/**
 * Маскирование номера для безопасного отображения в списке: •••• •••• •••• 1234
 */
export const maskCardNumber = (cardNumber: string): string => {
  const clean = cardNumber.replace(/\D/g, '');
  if (clean.length < 4) return cardNumber;
  const last4 = clean.slice(-4);
  return `•••• •••• •••• ${last4}`;
};

/**
 * Форматирование денежного значения
 */
export const formatMoney = (amount: number, currency = 'RUB', decimals = 2): string => {
  const symbolMap: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  };
  const symbol = symbolMap[currency] || currency;
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  return `${formatted} ${symbol}`;
};

/**
 * Конвертация суммы из одной валюты в другую через базовый курс к рублю
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
): number => {
  if (fromCurrency === toCurrency) return amount;
  const rateFrom = rates[fromCurrency] ?? 1; // стоимость fromCurrency в рублях
  const rateTo = rates[toCurrency] ?? 1; // стоимость toCurrency в рублях
  const amountInRub = amount * rateFrom;
  return amountInRub / rateTo;
};

/**
 * Форматирование даты актуальности курса
 */
export const formatExchangeRateDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
};
