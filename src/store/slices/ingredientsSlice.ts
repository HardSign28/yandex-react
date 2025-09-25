import { createSlice } from '@reduxjs/toolkit';

import { api } from '../api';

import type { TIngredientsState } from '@utils/types';

const initialState: TIngredientsState = { items: [], error: null };

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
        state.items = payload;
        state.error = null;
      })
      .addMatcher(api.endpoints.getIngredients.matchRejected, (state, action) => {
        state.items = [];
        state.error = action.error?.message ?? 'Ошибка загрузки ингредиентов';
      });
  },
});

export const { reset } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
