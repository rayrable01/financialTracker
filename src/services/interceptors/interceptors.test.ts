import { describe, it, expect, vi } from 'vitest';
import { withRequestId } from './withRequestId';
import { withResponseTransform } from './withResponseTransform';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';

describe('Интерцепторы сетевого слоя (src/services/interceptors)', () => {
  const dummyApi = {} as BaseQueryApi;
  const dummyExtraOptions = {};

  describe('withRequestId', () => {
    it('добавляет X-Request-Id к строковому url', async () => {
      let capturedHeaders: Headers | undefined;

      const mockBaseQuery = vi.fn(async (args) => {
        capturedHeaders = args.headers as Headers;
        return { data: { success: true } };
      });

      const queryWithId = withRequestId(mockBaseQuery);
      await queryWithId('/api/test', dummyApi, dummyExtraOptions);

      expect(mockBaseQuery).toHaveBeenCalledTimes(1);
      expect(capturedHeaders?.get('X-Request-Id')).toBeTruthy();
    });

    it('сохраняет ранее заданный X-Request-Id', async () => {
      let capturedHeaders: Headers | undefined;

      const mockBaseQuery = vi.fn(async (args) => {
        capturedHeaders = args.headers as Headers;
        return { data: { success: true } };
      });

      const queryWithId = withRequestId(mockBaseQuery);
      await queryWithId(
        {
          url: '/api/test',
          headers: { 'X-Request-Id': 'manual-uuid-999' },
        },
        dummyApi,
        dummyExtraOptions,
      );

      expect(capturedHeaders?.get('X-Request-Id')).toBe('manual-uuid-999');
    });
  });

  describe('withResponseTransform', () => {
    it('подмешивает isChanged: true в объект ответа', async () => {
      const mockBaseQuery = vi.fn(async () => ({
        data: { id: 1, title: 'Item 1' },
      }));

      const queryWithTransform = withResponseTransform(mockBaseQuery);
      const result = await queryWithTransform('/api/items/1', dummyApi, dummyExtraOptions);

      expect(result.data).toEqual({
        id: 1,
        title: 'Item 1',
        isChanged: true,
      });
    });

    it('подмешивает isChanged: true в массив и элементы ответа', async () => {
      const mockBaseQuery = vi.fn(async () => ({
        data: [{ id: 1 }, { id: 2 }],
      }));

      const queryWithTransform = withResponseTransform(mockBaseQuery);
      const result = await queryWithTransform('/api/items', dummyApi, dummyExtraOptions);

      const list = result.data as Array<{ id: number; isChanged?: boolean }> & {
        isChanged?: boolean;
      };

      expect(Array.isArray(list)).toBe(true);
      expect(list.isChanged).toBe(true);
      expect(list[0].isChanged).toBe(true);
      expect(list[1].isChanged).toBe(true);
    });

    it('не трогает ошибки', async () => {
      const mockBaseQuery = vi.fn(async () => ({
        error: { status: 404, data: 'Not Found' },
      }));

      const queryWithTransform = withResponseTransform(mockBaseQuery);
      const result = await queryWithTransform('/api/not-found', dummyApi, dummyExtraOptions);

      expect(result.error).toEqual({ status: 404, data: 'Not Found' });
      expect(result.data).toBeUndefined();
    });
  });

  describe('Композиция матрёшки (withResponseTransform + withRequestId)', () => {
    it('работает в связке: инжектит заголовок на входе и обогащает ответ на выходе', async () => {
      let capturedHeaders: Headers | undefined;

      const rawBaseQuery = vi.fn(async (args) => {
        capturedHeaders = args.headers as Headers;
        return { data: { message: 'hello' } };
      });

      const composedQuery = withResponseTransform(withRequestId(rawBaseQuery));
      const result = await composedQuery('/cards', dummyApi, dummyExtraOptions);

      expect(capturedHeaders?.get('X-Request-Id')).toBeTruthy();
      expect(result.data).toEqual({
        message: 'hello',
        isChanged: true,
      });
    });
  });
});
