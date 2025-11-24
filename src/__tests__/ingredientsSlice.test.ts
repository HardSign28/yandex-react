import ingredientsReducer, { initialState } from '@/store/slices/ingredientsSlice';
import { describe, it, expect } from 'vitest';

import type { UnknownAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

type TestMeta = {
  arg: {
    endpointName: string;
    originalArgs: unknown;
    type: string;
  };
};

const makeMeta = (): TestMeta => ({
  arg: {
    endpointName: 'getIngredients',
    originalArgs: undefined,
    type: 'query',
  },
});

describe('ingredientsSlice reducer', () => {
  it('initializes correctly', () => {
    const state = ingredientsReducer(undefined, { type: '' } as UnknownAction);
    expect(state).toEqual(initialState);
  });

  it('handles getIngredients.pending', () => {
    const action = {
      type: 'api/executeQuery/pending',
      meta: makeMeta(),
    };

    const next = ingredientsReducer(initialState, action as UnknownAction);

    expect(next).toEqual(initialState);
  });

  it('handles getIngredients.fulfilled', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '60666c42cc7b410027a1a9b1',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: '',
        image_mobile: '',
        image_large: '',
        __v: 0,
      },
    ];

    const action = {
      type: 'api/executeQuery/fulfilled',
      payload: ingredients,
      meta: makeMeta(),
    };

    const next = ingredientsReducer(initialState, action as UnknownAction);

    expect(next.items).toEqual(ingredients);
    expect(next.error).toBeNull();
  });

  it('handles getIngredients.rejected', () => {
    const action = {
      type: 'api/executeQuery/rejected',
      error: { message: 'Server error' },
      meta: makeMeta(),
    };

    const next = ingredientsReducer(initialState, action as UnknownAction);

    expect(next.error).toBe('Server error');
    expect(next.items).toEqual([]);
  });
});
