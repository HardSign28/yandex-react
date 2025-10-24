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

let refreshPromise: Promise<{ ok: boolean }> | null = null;

type RawErrorShape = {
  error?: {
    status?: number;
    data?: unknown;
  };
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  unknown,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const rawExtra = extraOptions as RawExtra;

  // Выполняем исходный запрос
  let result = await rawBaseQuery(args, api, rawExtra);

  // Хелпер: определим, нужно ли пытаться рефрешить
  const isTokenExpiredError = (res: unknown): res is RawErrorShape => {
    if (typeof res !== 'object' || res === null) return false;
    const obj = res as Record<string, unknown>;

    if (!('error' in obj)) return false;
    const errorField = obj.error;

    if (typeof errorField !== 'object' || errorField === null) return false;
    const err = errorField as Record<string, unknown>;

    const status =
      'status' in err && typeof err.status === 'number' ? err.status : undefined;
    const data = err.data;

    let message = '';
    if (typeof data === 'string') {
      message = data;
    } else if (typeof data === 'object' && data !== null) {
      const d = data as Record<string, unknown>;
      if ('message' in d && typeof d.message === 'string') message = d.message;
      else if ('error' in d && typeof d.error === 'string') message = d.error;
    }

    // считаем просроченным при 401, 403 или тексте с 'expired'
    if (status === 401 || status === 403) return true;
    return message === 'jwt expired';
  };

  if (isTokenExpiredError(result)) {
    const state = api.getState() as RootState;
    const refreshToken =
      state.auth?.refreshToken ?? localStorage.getItem('refreshToken');

    if (!refreshToken) {
      // нет refreshToken — разлогиниваемся
      api.dispatch(logoutAction());
      return result;
    }

    try {
      // Если рефреш уже запущен — дождёмся его (mutex)
      // Запускаем рефреш и сохраняем промис
      refreshPromise ??= (async (): Promise<{ ok: boolean }> => {
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

          const newAccess = payload.accessToken;
          const newRefresh = payload.refreshToken ?? refreshToken;

          api.dispatch(
            setCredentials({ accessToken: newAccess, refreshToken: newRefresh })
          );

          /*
          // При желании — синхронно сохранить в localStorage (но у вас есть listener, который это делает)
          // TODO: refactor
          try {
            if (newAccess) localStorage.setItem('accessToken', newAccess);
            if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
          } catch (_) {
            // ignore storage errors
          }
          */

          return { ok: true };
        } else {
          // не удалось рефрешить
          api.dispatch(logoutAction());
          return { ok: false };
        }
      })();

      // ждём завершения рефреша (успех/провал)
      const refreshResult = await refreshPromise;
      // сбрасываем mutex
      refreshPromise = null;

      // если рефреш успешен — повторяем исходный запрос
      if (refreshResult?.ok) {
        // повторный вызов: rawBaseQuery использует prepareHeaders который берёт accessToken из state,
        // поэтому после dispatch(setCredentials) header будет обновлён
        result = await rawBaseQuery(args, api, rawExtra);
      } else {
        // рефреш упал — возвращаем исходную ошибку (и logout уже выполнен)
        return result;
      }
    } catch (_) {
      // на случай непредвиденных ошибок
      refreshPromise = null;
      api.dispatch(logoutAction());
      return result;
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

    updateUser: build.mutation<
      TUser,
      { name?: string; email?: string; password?: string }
    >({
      async queryFn(body, _api, _extra, baseQuery) {
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
          method: 'PATCH',
          body,
          headers: { authorization: token },
        });

        if (response.error) return { error: response.error };

        const data = response.data as { success: boolean; user: TUser };

        if (!data?.success || !data.user) {
          return {
            error: {
              status: 500,
              data: { message: 'Ошибка обновления данных пользователя' },
            },
          };
        }

        return { data: data.user };
      },

      // аккуратно обновим кеш getUser и откатим при ошибке
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // оптимистический патч: сразу применяем изменения к кешу getUser
        // сохраняем undo функцию
        const patchResult = dispatch(
          api.util.updateQueryData('getUser', undefined, (draft) => {
            // draft — текущий TUser (или undefined). Обновляем только те поля, что пришли в arg
            if (!draft) return;
            if (typeof arg.name === 'string') draft.name = arg.name;
            if (typeof arg.email === 'string') draft.email = arg.email;
            // пароль мы в кеше не храним
          })
        );

        try {
          // дождёмся результата запроса, чтобы удостовериться, что всё успешно
          const { data } = await queryFulfilled;
          // синхронизируем кеш с реальным ответом сервера (на случай, если сервер изменил что-то ещё)
          dispatch(
            api.util.updateQueryData('getUser', undefined, (draft) => {
              if (!draft) return;
              draft.name = data.name;
              draft.email = data.email;
            })
          );
        } catch (_) {
          // при ошибке откатываем оптимистичный патч
          patchResult.undo();
        }
      },
    }),

    passwordReset: build.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: (body) => ({
        url: '/password-reset',
        method: 'POST',
        body,
      }),
    }),

    passwordResetConfirm: build.mutation<
      { success: boolean; message: string },
      { password: string; token: string }
    >({
      query: (body) => ({
        url: '/password-reset/reset',
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
  useGetUserQuery,
  useUpdateUserMutation,
  usePasswordResetMutation,
  usePasswordResetConfirmMutation,
} = api;
