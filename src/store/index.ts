import { api } from '@/store/api';
import authListener from '@/store/authListener';
import auth from '@/store/slices/authSlice';
import burgerConstructor from '@/store/slices/burgerConstructorSlice';
import ingredients from '@/store/slices/ingredientsSlice';
import order from '@/store/slices/orderSlice';
import selectedIngredient from '@/store/slices/selectedIngredientSlice';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { wsApi } from './thunks/wsApi';

const rootReducer = combineReducers({
  burgerConstructor,
  ingredients,
  selectedIngredient,
  order,
  auth,
  [api.reducerPath]: api.reducer,
  [wsApi.reducerPath]: wsApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(authListener.middleware)
      .concat(api.middleware)
      .concat(wsApi.middleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
