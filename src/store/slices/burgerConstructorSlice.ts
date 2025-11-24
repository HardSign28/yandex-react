import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorState, TIngredient, TIngredientUid } from '@utils/types';

export const initialState: TConstructorState = { bun: null, ingredients: [] };

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient | null>) {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer(state, action: PayloadAction<TIngredientUid>) {
        state.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        return { payload: { ...ingredient, uid: uuidv4() } };
      },
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.uid !== action.payload
      );
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const arr = [...state.ingredients];
      arr.splice(to, 0, arr.splice(from, 1)[0]);
      state.ingredients = arr;
    },
    resetConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
