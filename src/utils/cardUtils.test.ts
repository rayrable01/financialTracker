import { describe, it, expect } from 'vitest';
import {
  detectCardType,
  maskCardNumber,
  formatMoney,
  convertCurrency,
  formatExchangeRateDate,
} from './cardUtils';

describe('Утилиты для работы с картами (cardUtils)', () => {
  describe('detectCardType (определение платёжной системы)', () => {
    it('определяет карты платёжной системы Visa', () => {
      expect(detectCardType('4111 1111 1111 1111')).toBe('visa');
      expect(detectCardType('4000000000000000')).toBe('visa');
    });

    it('определяет карты платёжной системы Mastercard', () => {
      expect(detectCardType('5500 0000 0000 0004')).toBe('mastercard');
      expect(detectCardType('5100000000000000')).toBe('mastercard');
    });

    it('определяет карты платёжной системы МИР', () => {
      expect(detectCardType('2200 0000 0000 0000')).toBe('mir');
      expect(detectCardType('2204000000000000')).toBe('mir');
    });

    it('возвращает "unknown" для пустых, невалидных или неизвестных номеров', () => {
      expect(detectCardType('')).toBe('unknown');
      expect(detectCardType('0000')).toBe('unknown');
      expect(detectCardType('abcdef')).toBe('unknown');
    });
  });

  describe('maskCardNumber (маскирование номера карты)', () => {
    it('маскирует стандартный 16-значный номер, оставляя последние 4 цифры', () => {
      expect(maskCardNumber('1234567890123456')).toBe('•••• •••• •••• 3456');
    });

    it('маскирует отформатированный номер карты с пробелами', () => {
      expect(maskCardNumber('4111 2222 3333 4444')).toBe('•••• •••• •••• 4444');
    });

    it('возвращает исходную строку, если в ней меньше 4 цифр', () => {
      expect(maskCardNumber('123')).toBe('123');
      expect(maskCardNumber('')).toBe('');
    });

    it('корректно маскирует ввод ровно из 4 цифр', () => {
      expect(maskCardNumber('9876')).toBe('•••• •••• •••• 9876');
    });
  });

  describe('formatMoney (форматирование денежных сумм)', () => {
    it('форматирует целое число в рублях без дробной части по умолчанию', () => {
      const result = formatMoney(1000, 'RUB');
      const normalized = result.replace(/\u00a0/g, ' ');
      expect(normalized).toBe('1 000 ₽');
    });

    it('форматирует дробную сумму с заданным количеством знаков после запятой', () => {
      const result = formatMoney(1234.56, 'RUB', 2);
      const normalized = result.replace(/\u00a0/g, ' ');
      expect(normalized).toBe('1 234,56 ₽');
    });

    it('форматирует сумму в долларах с символом $', () => {
      const result = formatMoney(100, 'USD');
      const normalized = result.replace(/\u00a0/g, ' ');
      expect(normalized).toBe('100 $');
    });

    it('форматирует сумму в евро с символом €', () => {
      const result = formatMoney(250.5, 'EUR', 2);
      const normalized = result.replace(/\u00a0/g, ' ');
      expect(normalized).toBe('250,50 €');
    });

    it('использует код валюты как fallback, если символ не задан в таблице', () => {
      const result = formatMoney(500, 'GBP');
      const normalized = result.replace(/\u00a0/g, ' ');
      expect(normalized).toBe('500 GBP');
    });
  });

  describe('convertCurrency (конвертация валют)', () => {
    const mockRates: Record<string, number> = {
      RUB: 1,
      USD: 80,
      EUR: 100,
    };

    it('возвращает исходную сумму, если исходная и целевая валюты совпадают', () => {
      expect(convertCurrency(500, 'USD', 'USD', mockRates)).toBe(500);
      expect(convertCurrency(1000, 'RUB', 'RUB', mockRates)).toBe(1000);
    });

    it('конвертирует иностранную валюту в рубли по базовому курсу', () => {
      // 100 USD * 80 / 1 = 8000 RUB
      expect(convertCurrency(100, 'USD', 'RUB', mockRates)).toBe(8000);
    });

    it('конвертирует рубли в иностранную валюту', () => {
      // 8000 RUB * 1 / 80 = 100 USD
      expect(convertCurrency(8000, 'RUB', 'USD', mockRates)).toBe(100);
    });

    it('конвертирует между двумя иностранными валютами через рубли', () => {
      // 100 EUR * 100 = 10000 RUB -> 10000 / 80 = 125 USD
      expect(convertCurrency(100, 'EUR', 'USD', mockRates)).toBe(125);
    });

    it('использует единичный курс по умолчанию, если валюта отсутствует в таблице курсов', () => {
      expect(convertCurrency(150, 'UNKNOWN', 'RUB', mockRates)).toBe(150);
      expect(convertCurrency(200, 'RUB', 'UNKNOWN', mockRates)).toBe(200);
    });
  });

  describe('formatExchangeRateDate (форматирование даты актуальности курса)', () => {
    it('возвращает пустую строку для пустого значения даты', () => {
      expect(formatExchangeRateDate('')).toBe('');
    });

    it('форматирует валидную дату ISO в русскоязычное текстовое представление', () => {
      const dateStr = '2026-09-30T10:00:00.000Z';
      const formatted = formatExchangeRateDate(dateStr);
      expect(formatted).toMatch(/2026/);
      expect(formatted).toMatch(/сентябр/i);
    });

    it('возвращает исходное значение при передаче невалидной даты', () => {
      expect(formatExchangeRateDate('invalid-date-string')).toBe('invalid-date-string');
    });
  });
});
