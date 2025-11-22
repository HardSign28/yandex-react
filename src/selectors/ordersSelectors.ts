import { wsApi } from '@/store/thunks/wsApi';
import { createSelector } from '@reduxjs/toolkit';

export const makeSelectOrderByNumber = (orderNumber: number, token: string) =>
  createSelector(
    [wsApi.endpoints.feedOrders.select(), wsApi.endpoints.userOrders.select(token)],
    (feedData, userData) => {

      console.log('feedData', feedData);
      console.log('userData', userData);
      console.log('orderNumber', orderNumber);
      const allOrders = [
        ...(feedData?.data?.orders ?? []),
        ...(userData?.data?.orders ?? []),
      ];

      return allOrders.find((o) => o.number === orderNumber) ?? null;
    }
  );
