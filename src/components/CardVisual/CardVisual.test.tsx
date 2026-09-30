import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardVisual } from './CardVisual';
import styles from './CardVisual.module.css';

describe('Компонент визуального отображения карты (CardVisual)', () => {
  it('отображает стандартные плейсхолдеры при отсутствии переданных пропсов', () => {
    render(<CardVisual />);

    expect(screen.getByText('•••• •••• •••• ••••')).toBeInTheDocument();
    expect(screen.getByText('CARDHOLDER NAME')).toBeInTheDocument();
    expect(screen.getByText('MM/YY')).toBeInTheDocument();
    expect(screen.getByText('BANK')).toBeInTheDocument();
    expect(screen.getByText('YOUNG TRAD.')).toBeInTheDocument();
  });

  it('отображает переданные реквизиты карты (номер, держатель, срок, тип)', () => {
    render(
      <CardVisual
        cardNumber="4111 2222 3333 4444"
        cardHolder="ALEXANDER PUSHKIN"
        expiryDate="08/29"
        cardType="visa"
      />,
    );

    expect(screen.getByText('4111 2222 3333 4444')).toBeInTheDocument();
    expect(screen.getByText('ALEXANDER PUSHKIN')).toBeInTheDocument();
    expect(screen.getByText('08/29')).toBeInTheDocument();
    expect(screen.getByText('VISA')).toBeInTheDocument();
  });

  it('рендерит бейдж платёжной системы МИР', () => {
    render(<CardVisual cardType="mir" />);
    expect(screen.getByText('МИР')).toBeInTheDocument();
  });

  it('рендерит фирменные круги платёжной системы Mastercard', () => {
    const { container } = render(<CardVisual cardType="mastercard" />);
    const redCircle = container.querySelector(`.${styles.circleRed}`);
    const yellowCircle = container.querySelector(`.${styles.circleYellow}`);
    expect(redCircle).toBeInTheDocument();
    expect(yellowCircle).toBeInTheDocument();
  });

  it('применяет кастомный класс className и класс цветового градиента', () => {
    const { container } = render(<CardVisual gradient="ocean" className="custom-test-card" />);
    const cardEl = container.firstChild as HTMLElement;
    expect(cardEl).toHaveClass('custom-test-card');
  });
});
