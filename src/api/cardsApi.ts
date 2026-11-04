import type { Card, CreateCardDto, UpdateCardDto } from '../types/cards';

import { baseApi } from '@/api/baseApiConfiguration';

export const cardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCards: builder.query<Card[], void>({
      query: () => '/cards',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Cards' as const, id })),
              { type: 'Cards', id: 'LIST' },
            ]
          : [{ type: 'Cards', id: 'LIST' }],
    }),

    createCard: builder.mutation<Card, CreateCardDto>({
      query: (card) => ({
        url: '/cards',
        method: 'POST',
        body: card,
      }),
      invalidatesTags: [{ type: 'Cards', id: 'LIST' }],
    }),

    updateCard: builder.mutation<Card, { id: string; data: UpdateCardDto }>({
      query: ({ id, data }) => ({
        url: `/cards/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Cards', id },
        { type: 'Cards', id: 'LIST' },
      ],
    }),

    deleteCard: builder.mutation<Card, string>({
      query: (id) => ({
        url: `/cards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Cards', id },
        { type: 'Cards', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCardsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} = cardsApi;
