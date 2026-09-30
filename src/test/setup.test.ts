import { describe, it, expect } from 'vitest';

describe('Конфигурация тестового окружения', () => {
  it('корректно инициализирует полифилл window.matchMedia', () => {
    expect(window.matchMedia).toBeDefined();
    const mq = window.matchMedia('(max-width: 600px)');
    expect(mq.matches).toBe(false);
    expect(typeof mq.addEventListener).toBe('function');
  });

  it('предоставляет кастомные матчеры jest-dom для DOM-элементов', () => {
    const el = document.createElement('div');
    el.textContent = 'Привет Vitest';
    document.body.appendChild(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Привет Vitest');
  });
});
