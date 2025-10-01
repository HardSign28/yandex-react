import { API_URL } from '@/constants/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TIngredient, TOrderDetails } from '@utils/types';

type IngredientsResponse = { success: boolean; data?: TIngredient[]; message?: string };
type OrderResponse = { success: boolean } & TOrderDetails;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (build) => ({
    getIngredients: build.query<TIngredient[], void>({
      async queryFn(_arg, _api, _extra, baseQuery) {
        const response = await baseQuery('/ingredients');
        if (response.error) return { error: response.error };
        const payload = response.data as IngredientsResponse;
        if (!payload?.success || !Array.isArray(payload.data)) {
          return {
            error: { status: 500, data: { message: 'Ошибка загрузки ингредиентов' } },
          };
        }
        return { data: payload.data };
      },
    }),
    createOrder: build.mutation<TOrderDetails, { ingredients: string[] }>({
      async queryFn(body, _api, _extra, baseQuery) {
        const response = await baseQuery({ url: '/orders', method: 'POST', body });
        if (response.error) return { error: response.error };
        const payload = response.data as OrderResponse;
        if (!payload?.success) {
          return {
            error: { status: 500, data: { message: 'ошибка оформления заказа' } },
          };
        }
        const { ...order } = payload;
        return { data: order as TOrderDetails };
      },
    }),
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation } = api;
