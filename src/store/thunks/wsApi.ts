import { WS_API_URL } from '@/constants/api';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAccessToken } from '@utils/auth.ts';
import { refreshTokenWS } from '@utils/refreshTokenWS.ts';

import type { TOrdersWSResponse } from '@utils/types';

function initWebSocket(
  getUrl: () => string,
  updateCachedData: (fn: (draft: TOrdersWSResponse) => void) => void,
  isActive: () => boolean
): WebSocket {
  let reconnectAttempts = 0;

  const connect = (): WebSocket => {
    const socket = new WebSocket(getUrl());

    socket.onopen = (): void => {
      reconnectAttempts = 0;
    };

    socket.onmessage = async (event): Promise<void> => {
      const message = String(event.data);
      const raw = JSON.parse(message) as { success?: boolean; message?: string };

      if (raw?.message === 'Invalid or missing token') {
        const newToken = await refreshTokenWS();

        if (!newToken) {
          socket.close();
          return;
        }

        socket.close();
        if (isActive()) connect();
        return;
      }

      updateCachedData(() => raw as TOrdersWSResponse);
    };

    socket.onclose = (): void => {
      if (!isActive()) return;

      const fib = (n: number): number => {
        if (n <= 1) return 1;
        let a = 1,
          b = 1;
        for (let i = 2; i <= n; i++) {
          const c = a + b;
          a = b;
          b = c;
        }
        return b;
      };

      const timeout = Math.min(fib(reconnectAttempts) * 1000, 21000);
      reconnectAttempts++;

      setTimeout(() => {
        console.log(`socket disconnected. Retrying to connect in ${timeout}ms...`);
        if (isActive()) connect();
      }, timeout);
    };

    socket.onerror = (): void => {
      socket.close();
    };

    return socket;
  };

  return connect();
}

export const wsApi = createApi({
  reducerPath: 'wsApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    feedOrders: builder.query<TOrdersWSResponse, void>({
      keepUnusedDataFor: 0,
      queryFn: () => ({ data: {} as TOrdersWSResponse }),

      async onCacheEntryAdded(_arg, api) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { updateCachedData, cacheDataLoaded, cacheEntryRemoved } = api;

        let active = true;
        const isActive = (): boolean => active;

        const socket = initWebSocket(
          () => `${WS_API_URL}/orders/all`,
          updateCachedData,
          isActive
        );

        await cacheDataLoaded;
        await cacheEntryRemoved;

        active = false;
        socket.close();
        console.log('socket feedOrders closed');
      },
    }),

    userOrders: builder.query<TOrdersWSResponse, string>({
      keepUnusedDataFor: 0,
      queryFn: () => ({ data: {} as TOrdersWSResponse }),

      async onCacheEntryAdded(_arg, api) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { updateCachedData, cacheDataLoaded, cacheEntryRemoved } = api;

        let active = true;
        const isActive = (): boolean => active;

        const socket = initWebSocket(
          () =>
            `${WS_API_URL}/orders?token=${getAccessToken()?.replace('Bearer ', '') ?? ''}`,
          updateCachedData,
          isActive
        );

        await cacheDataLoaded;
        await cacheEntryRemoved;

        active = false;
        socket.close();
        console.log('socket userOrders closed');
      },
    }),
  }),
});

export const { useFeedOrdersQuery, useUserOrdersQuery } = wsApi;
