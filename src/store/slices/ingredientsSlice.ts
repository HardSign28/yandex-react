import { createSlice } from '@reduxjs/toolkit';

import { api } from '../api';

import type { IngredientsState } from '@utils/types';

const initialState: IngredientsState = { items: [], error: null };

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    reset(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.getIngredients.matchFulfilled, (state, { payload }) => {
        state.items = payload.data ?? [];
        state.error = null;
      })
      .addMatcher(api.endpoints.getIngredients.matchRejected, (state) => {
        state.items = [];
        state.error = 'Failed to load ingredients';
      });
  },
});
export const { reset: resetIngredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
