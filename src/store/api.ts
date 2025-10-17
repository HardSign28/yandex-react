import { API_URL } from '@/constants/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { setCredentials, logout as logoutAction } from './slices/authSlice';

import type { RootState } from '@/store';
import type { AuthResponse, TIngredient, TOrderDetails } from '@utils/types';

type IngredientsResponse = { success: boolean; data?: TIngredient[]; message?: string };
type OrderResponse = { success: boolean } & TOrderDetails;

const baseUrl = API_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // попробуем обновить токен
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      // нет refresh — разлогиниваемся
      api.dispatch(logoutAction());
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/token',
        method: 'POST',
        body: { token: refreshToken }, // форма тела зависит от вашего API
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const payload = refreshResult.data as AuthResponse;
      // достаём токены (приведите в соответствие с тем, что возвращает бэкенд)
      const accessToken = payload.accessToken?.replace('Bearer ', '') ?? '';
      const newRefresh = payload.refreshToken ?? refreshToken;

      // сохраняем в state
      api.dispatch(setCredentials({ accessToken, refreshToken: newRefresh }));

      // повторяем исходный запрос с обновлённым токеном
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // refresh не сработал — разлогиниваем
      api.dispatch(logoutAction());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Orders', 'Ingredients', 'Auth'],
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
      providesTags: ['Ingredients'],
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
      invalidatesTags: ['Orders'],
    }),

    login: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    register: build.mutation<
      AuthResponse,
      { name?: string; email: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: build.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    refreshToken: build.mutation<AuthResponse, { token: string }>({
      query: (body) => ({
        url: '/auth/token',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetIngredientsQuery,
  useCreateOrderMutation,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = api;
