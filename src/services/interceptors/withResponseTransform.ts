import type { Interceptor } from '@/store';

export const withResponseTransform: Interceptor = (baseQuery) => {
  return async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.data && typeof result.data === 'object') {
      if (Array.isArray(result.data)) {
        // Для массива: обогащаем каждый элемент и объект массива
        result.data = Object.assign(
          result.data.map((item) =>
            item && typeof item === 'object' ? { ...item, isChanged: true } : item,
          ),
          { isChanged: true },
        );
      } else {
        // Для одиночного объекта
        result.data = {
          ...result.data,
          isChanged: true,
        };
      }
    }

    return result;
  };
};
