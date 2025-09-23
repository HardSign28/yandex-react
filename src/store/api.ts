import { API_URL } from '@/constants/api.ts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TIngredient, TOrderDetails } from '@utils/types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (build) => ({
    getIngredients: build.query<{ success: boolean; data: TIngredient[] }, void>({
      query: () => '/ingredients',
    }),
    createOrder: build.mutation<TOrderDetails, { ingredients: string[] }>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation } = api;
