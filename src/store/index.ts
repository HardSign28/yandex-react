import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { api } from './api';
import authListener from './authListener';
import auth from './slices/authSlice';
import burgerConstructor from './slices/burgerConstructorSlice';
import ingredients from './slices/ingredientsSlice';
import order from './slices/orderSlice';
import selectedIngredient from './slices/selectedIngredientSlice';

const rootReducer = combineReducers({
  burgerConstructor,
  ingredients,
  selectedIngredient,
  order,
  auth,
  [api.reducerPath]: api.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authListener.middleware).concat(api.middleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
