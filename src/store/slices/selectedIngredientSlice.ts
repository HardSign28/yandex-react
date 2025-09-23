import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { SelectedState, TIngredient } from '@utils/types';

const initialState: SelectedState = { current: null };

const selectedIngredientSlice = createSlice({
  name: 'selectedIngredient',
  initialState,
  reducers: {
    select(state, action: PayloadAction<TIngredient | null>) {
      state.current = action.payload;
    },
  },
});
export const { select } = selectedIngredientSlice.actions;
export default selectedIngredientSlice.reducer;
