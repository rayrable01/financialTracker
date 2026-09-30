import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TotalBalanceCard } from './TotalBalanceCard';
import type { Card } from '../../types/cards';

const mockCards: Card[] = [
  {
    id: '1',
    cardNumber: '4111222233334444',
    cardHolder: 'USER ONE',
    expiryDate: '12/28',
    cardType: 'visa',
    balance: 1000,
    currency: 'RUB',
    gradient: 'purple',
    createdAt: '2026-09-30T10:00:00.000Z',
  },
  {
    id: '2',
    cardNumber: '5500000000000004',
    cardHolder: 'USER TWO',
    expiryDate: '11/29',
    cardType: 'mastercard',
    balance: 100,
    currency: 'USD',
    gradient: 'blue',
    createdAt: '2026-09-30T10:00:00.000Z',
  },
];

vi.mock('../../api/ratesApi', () => ({
  useGetExchangeRatesQuery: () => ({
    data: {
      rates: { RUB: 1, USD: 80, EUR: 100 },
      date: '2026-09-30',
    },
    isLoading: false,
  }),
}));

describe('Компонент карточки общего баланса (TotalBalanceCard)', () => {
  it('отображает заголовок "Общий баланс" и кнопки переключения валют (RUB, USD, EUR)', () => {
    render(<TotalBalanceCard cards={mockCards} />);

    expect(screen.getByText('Общий баланс')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'RUB' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'USD' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EUR' })).toBeInTheDocument();
  });

  it('вычисляет общий конвертированный баланс в рублях по умолчанию', () => {
    render(<TotalBalanceCard cards={mockCards} />);
    // 1000 RUB + (100 USD * 80) = 9000 RUB
    const amountEl = screen.getByText(/9\s?000\s?₽/);
    expect(amountEl).toBeInTheDocument();
  });

  it('динамически пересчитывает сумму при переключении целевой валюты', async () => {
    const user = userEvent.setup();
    render(<TotalBalanceCard cards={mockCards} />);

    const usdBtn = screen.getByRole('button', { name: 'USD' });
    await user.click(usdBtn);

    // 9000 RUB / 80 = 112.50 USD
    expect(screen.getByText(/112,50\s?\$/)).toBeInTheDocument();
  });

  it('отображает бейджи исходных балансов при наличии карт в разных валютах', () => {
    render(<TotalBalanceCard cards={mockCards} />);

    // Раздельные суммы: 1000 ₽ и 100 $
    expect(screen.getByText(/1\s?000\s?₽/)).toBeInTheDocument();
    expect(screen.getByText(/100\s?\$/)).toBeInTheDocument();
  });

  it('скрывает бейджи разбивки, если все привязанные карты имеют одну и ту же валюту', () => {
    const singleCurrencyCards: Card[] = [
      {
        ...mockCards[0],
        id: '1',
      },
      {
        ...mockCards[0],
        id: '2',
        balance: 2000,
      },
    ];

    const { container } = render(<TotalBalanceCard cards={singleCurrencyCards} />);
    expect(container.querySelector('.originalBreakdown')).toBeNull();
  });

  it('отображает нулевой баланс (0 ₽) при пустом списке карт', () => {
    render(<TotalBalanceCard cards={[]} />);
    expect(screen.getByText(/0\s?₽/)).toBeInTheDocument();
  });
});
