import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackBanner } from './FeedbackBanner';

describe('Компонент баннера уведомлений (FeedbackBanner)', () => {
  it('не рендерит разметку, если текст сообщения пустой', () => {
    const { container } = render(<FeedbackBanner type="success" message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('отображает текст успешного действия и применяет класс успеха', () => {
    const { container } = render(
      <FeedbackBanner type="success" message="Операция успешно выполнена" />,
    );

    expect(screen.getByText('Операция успешно выполнена')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(/success/);
  });

  it('отображает текст ошибки и применяет класс ошибки', () => {
    const { container } = render(
      <FeedbackBanner type="error" message="Произошла непредвиденная ошибка" />,
    );

    expect(screen.getByText('Произошла непредвиденная ошибка')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(/error/);
  });

  it('рендерит кнопку закрытия при передаче onClose и вызывает колбэк по клику', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <FeedbackBanner type="success" message="Уведомление с кнопкой закрытия" onClose={onClose} />,
    );

    const closeBtn = screen.getByRole('button', { name: 'Закрыть' });
    expect(closeBtn).toBeInTheDocument();

    await user.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('не отображает кнопку закрытия, если проп onClose не передан', () => {
    render(<FeedbackBanner type="success" message="Без кнопки закрытия" />);
    expect(screen.queryByRole('button', { name: 'Закрыть' })).toBeNull();
  });
});
