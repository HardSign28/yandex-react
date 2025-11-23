import { describe, it, expect } from 'vitest';
import ingredientsReducer from '@/store/slices/ingredientsSlice';
import type { TIngredient, TIngredientsState } from '@utils/types';

//
// Вспомогательная функция для генерации meta,
// чтобы matchers RTK Query сработали
//
const makeMeta = () => ({
  arg: {
    endpointName: 'getIngredients',
    originalArgs: undefined,
    type: 'query',
  },
});

describe('ingredientsSlice reducer', () => {
  const initialState: TIngredientsState = {
    items: [],
    error: null,
  };

  it('initializes correctly', () => {
    const state = ingredientsReducer(undefined, { type: '' } as any);
    expect(state).toEqual(initialState);
  });

  it('handles getIngredients.pending', () => {
    const action = {
      type: 'api/executeQuery/pending',
      meta: makeMeta(),
    };

    const next = ingredientsReducer(initialState, action as any);

    // pending не изменяет состояние
    expect(next).toEqual(initialState);
  });

  it('handles getIngredients.fulfilled', () => {
    const ingredients: TIngredient[] = [
      {
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
      },
    ];

    const action = {
      type: 'api/executeQuery/fulfilled',
      payload: ingredients,
      meta: makeMeta(),
    };

    const next = ingredientsReducer(initialState, action as any);

    expect(next.items).toEqual(ingredients);
    expect(next.error).toBeNull();
  });

  it('handles getIngredients.rejected', () => {
    const action = {
      type: 'api/executeQuery/rejected',
      error: { message: 'Server error' },
      meta: makeMeta(),
    };

    const next = ingredientsReducer(initialState, action as any);

    expect(next.error).toBe('Server error');
    expect(next.items).toEqual([]);
  });
});
