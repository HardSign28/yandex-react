import { createSlice } from '@reduxjs/toolkit';

import { api } from '../api';

import type { TOrderState } from '@utils/types';

const initialState: TOrderState = { last: null, error: null, isLoading: false };

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.last = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.createOrder.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.last = null;
      })
      .addMatcher(api.endpoints.createOrder.matchFulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.last = payload;
        state.error = null;
      })
      .addMatcher(api.endpoints.createOrder.matchRejected, (state, action) => {
        state.isLoading = false;
        state.last = null;
        state.error = action.error?.message ?? 'Ошибка оформления заказа';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
