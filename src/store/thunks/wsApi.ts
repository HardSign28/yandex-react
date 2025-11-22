import { WS_API_URL } from '@/constants/api';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TOrdersWSResponse } from '@utils/types';

function initWebSocket(
  this: void,
  url: string,
  updateCachedData: (fn: (draft: TOrdersWSResponse) => void) => void,
  isActive: () => boolean
): WebSocket {
  let reconnectAttempts = 0;

  const connect = (): WebSocket => {
    const socket = new WebSocket(url);

    socket.onopen = (): void => {
      reconnectAttempts = 0;
    };

    socket.onmessage = (event): void => {
      const message = String(event.data);
      const raw = JSON.parse(message) as unknown;
      const wsData = raw as TOrdersWSResponse;
      updateCachedData(() => wsData);
    };

    socket.onclose = (): void => {
      if (!isActive()) return;

      const timeout = Math.min(1000 * 2 ** reconnectAttempts, 8000);
      reconnectAttempts++;

      setTimeout(() => {
        console.log('socket disconnected. Retrying to connect...');
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
          `${WS_API_URL}/orders/all`,
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

      async onCacheEntryAdded(token, api) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { updateCachedData, cacheDataLoaded, cacheEntryRemoved } = api;

        let active = true;
        const isActive = (): boolean => active;

        const socket = initWebSocket(
          `${WS_API_URL}/orders?token=${token}`,
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
