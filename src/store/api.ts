import { API_URL } from '@/constants/api';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAccessToken } from '@utils/auth';

import type { RootState } from '@/store';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import type {
  TAuthResponse,
  TIngredient,
  TIngredientsResponse,
  TOrderDetails,
  TOrderResponse,
  TUser,
} from '@utils/types';

type RawExtra = Parameters<typeof rawBaseQuery>[2];

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token) {
      headers.set('authorization', token);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  unknown,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const rawExtra = extraOptions as RawExtra;
  let result = await rawBaseQuery(args, api, rawExtra);

  if (result?.error?.status === 401) {
    // Пробуем обновить токен
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      // Нет refreshToken'а — разлогиниваемся
      api.dispatch(logoutAction());
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/token',
        method: 'POST',
        body: { token: refreshToken },
      },
      api,
      rawExtra
    );

    if (refreshResult?.data) {
      const payload = refreshResult.data as TAuthResponse;

      const accessToken = payload.accessToken?.replace('Bearer ', '') ?? '';
      const newRefresh = payload.refreshToken ?? refreshToken;

      api.dispatch(setCredentials({ accessToken, refreshToken: newRefresh }));

      result = await rawBaseQuery(args, api, rawExtra);
    } else {
      // Если refresh не сработал — разлогиниваемся
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
        const payload = response.data as TIngredientsResponse;
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
        const payload = response.data as TOrderResponse;
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

    login: build.mutation<TAuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    register: build.mutation<
      TAuthResponse,
      { name?: string; email: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: build.mutation<TAuthResponse, string>({
      query: (token) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['Auth'],
    }),

    refreshToken: build.mutation<TAuthResponse, { token: string }>({
      query: (body) => ({
        url: '/auth/token',
        method: 'POST',
        body,
      }),
    }),

    getUser: build.query<TUser, void>({
      async queryFn(_arg, _api, _extra, baseQuery) {
        const token = getAccessToken();
        if (!token) {
          return {
            error: {
              status: 401,
              data: { message: 'Токен не найден' },
            },
          };
        }

        const response = await baseQuery({
          url: '/auth/user',
          method: 'GET',
          headers: { authorization: token },
        });

        if (response.error) return { error: response.error };
        const data = response.data as { success: boolean; user: TUser };

        if (!data?.success || !data.user) {
          return {
            error: {
              status: 500,
              data: { message: 'Ошибка получения данных пользователя' },
            },
          };
        }

        return { data: data.user };
      },
      providesTags: ['Auth'],
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
  useGetUserQuery,
} = api;
