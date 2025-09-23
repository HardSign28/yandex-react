import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { api } from './api';
import burgerConstructor from './slices/burgerConstructorSlice.ts';
import ingredients from './slices/ingredientsSlice';
import order from './slices/orderSlice';
import selectedIngredient from './slices/selectedIngredientSlice';

const rootReducer = combineReducers({
  burgerConstructor,
  ingredients,
  selectedIngredient,
  order,
  [api.reducerPath]: api.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) => gDM().concat(api.middleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
