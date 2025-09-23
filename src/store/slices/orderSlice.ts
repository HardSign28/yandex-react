import { createSlice } from '@reduxjs/toolkit';

import { api } from '../api';

import type { OrderState } from '@utils/types';

const initialState: OrderState = { last: null };

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.last = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.createOrder.matchFulfilled, (state, { payload }) => {
        state.last = payload;
      })
      .addMatcher(api.endpoints.createOrder.matchRejected, (state) => {
        state.last = null;
      });
  },
});
export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
