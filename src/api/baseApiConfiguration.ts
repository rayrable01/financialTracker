import { API_URL } from '@/api/apiRouter';
import { withRequestId } from '@/services/interceptors/withRequestId';
import { withResponseTransform } from '@/services/interceptors/withResponseTransform';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({ baseUrl: API_URL });

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: withResponseTransform(withRequestId(rawBaseQuery)),
  tagTypes: ['Rates', 'Cards'],
  endpoints: () => ({}),
});
