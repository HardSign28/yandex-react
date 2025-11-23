import { describe, it, expect } from 'vitest';
import selectedIngredientReducer, { select } from '@/store/slices/selectedIngredientSlice';
import type { TIngredient, TSelectedState } from '@utils/types';

describe('selectedIngredientSlice reducer', () => {
  const initialState: TSelectedState = {
    current: null,
  };

  it('initializes correctly', () => {
    const state = selectedIngredientReducer(undefined, { type: '' } as any);
    expect(state).toEqual(initialState);
  });

  it('select sets current ingredient', () => {
    const ingredient: TIngredient = {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 50,
      image: '',
      image_large: '',
      image_mobile: '',
      __v: 0,
    };

    const action = { type: select.type, payload: ingredient };
    const next = selectedIngredientReducer(initialState, action as any);

    expect(next.current).toEqual(ingredient);
  });

  it('select(null) resets selected ingredient', () => {
    const dirty: TSelectedState = {
      current: {
        _id: '2',
        name: 'Соус',
        type: 'sauce',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 10,
        image: '',
        image_large: '',
        image_mobile: '',
        __v: 0,
      },
    };

    const action = { type: select.type, payload: null };
    const next = selectedIngredientReducer(dirty, action as any);

    expect(next.current).toBeNull();
  });
});
