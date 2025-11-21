import { WS_API_URL } from '@/constants/api';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TOrdersWSResponse } from '@utils/types';

function initWebSocket(
  this: void,
  url: string,
  updateCachedData: (fn: (draft: TOrdersWSResponse) => void) => void
): WebSocket {
  const socket = new WebSocket(url);

  socket.onmessage = (event): void => {
    const message = String(event.data);
    const raw = JSON.parse(message) as unknown;
    const wsData = raw as TOrdersWSResponse;
    updateCachedData(() => wsData);
  };

  return socket;
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

        const socket = initWebSocket(`${WS_API_URL}/orders/all`, updateCachedData);

        await cacheDataLoaded;
        await cacheEntryRemoved;

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

        const socket = initWebSocket(
          `${WS_API_URL}/orders?token=${token}`,
          updateCachedData
        );

        await cacheDataLoaded;
        await cacheEntryRemoved;

        socket.close();
        console.log('socket userOrders closed');
      },
    }),
  }),
});

export const { useFeedOrdersQuery, useUserOrdersQuery } = wsApi;
