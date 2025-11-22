import { wsApi } from '@/store/thunks/wsApi';
import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { TOrder, TOrdersWSResponse } from '@/utils/types';

export const makeSelectOrderByNumber = (
  orderNumber: number,
  token: string
): ((state: RootState) => TOrder | null) =>
  createSelector(
    [wsApi.endpoints.feedOrders.select(), wsApi.endpoints.userOrders.select(token)],

    (
      feedData: { data?: TOrdersWSResponse } | undefined,
      userData: { data?: TOrdersWSResponse } | undefined
    ): TOrder | null => {
      const allOrders: TOrder[] = [
        ...(feedData?.data?.orders ?? []),
        ...(userData?.data?.orders ?? []),
      ];

      return allOrders.find((o) => o.number === orderNumber) ?? null;
    }
  );
