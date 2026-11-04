import { baseApi } from '@/api/baseApiConfiguration';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners, type BaseQueryFn } from '@reduxjs/toolkit/query';

export type Interceptor = (baseQuery: BaseQueryFn) => BaseQueryFn;

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
