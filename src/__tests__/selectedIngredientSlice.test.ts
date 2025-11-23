import selectedIngredientReducer, {
  select,
} from '@/store/slices/selectedIngredientSlice';
import { describe, it, expect } from 'vitest';

import type { UnknownAction } from '@reduxjs/toolkit';
import type { TIngredient, TSelectedState } from '@utils/types';

describe('selectedIngredientSlice reducer', () => {
  const initialState: TSelectedState = {
    current: null,
  };

  it('initializes correctly', () => {
    const state = selectedIngredientReducer(undefined, { type: '' } as UnknownAction);
    expect(state).toEqual(initialState);
  });

  it('select sets current ingredient', () => {
    const ingredient: TIngredient = {
      _id: '60666c42cc7b410027a1a9b1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: '',
      image_large: '',
      image_mobile: '',
      __v: 0,
    };

    const action = { type: select.type, payload: ingredient };
    const next = selectedIngredientReducer(initialState, action as UnknownAction);

    expect(next.current).toEqual(ingredient);
  });

  it('select(null) resets selected ingredient', () => {
    const dirty: TSelectedState = {
      current: {
        _id: '60666c42cc7b410027a1a9b5',
        name: 'Говяжий метеорит (отбивная)',
        type: 'main',
        proteins: 800,
        fat: 800,
        carbohydrates: 300,
        calories: 2674,
        price: 3000,
        image: '',
        image_large: '',
        image_mobile: '',
        __v: 0,
      },
    };

    const action = { type: select.type, payload: null };
    const next = selectedIngredientReducer(dirty, action as UnknownAction);

    expect(next.current).toBeNull();
  });
});
