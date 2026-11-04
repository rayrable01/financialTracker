import type { Interceptor } from '@/store';
import type { FetchArgs } from '@reduxjs/toolkit/query';

export const withRequestId: Interceptor = (baseQuery) => {
  return async (args, api, extraOptions) => {
    const requestArgs: FetchArgs = typeof args === 'string' ? { url: args } : { ...args };
    const headers = new Headers(requestArgs.headers as HeadersInit);

    if (!headers.has('X-Request-Id')) {
      headers.set('X-Request-Id', crypto.randomUUID());
    }

    requestArgs.headers = headers;

    return baseQuery(requestArgs, api, extraOptions);
  };
};
