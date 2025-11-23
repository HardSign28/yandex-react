import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun,
  resetConstructor,
} from '@/store/slices/burgerConstructorSlice';
import { describe, it, expect } from 'vitest';

import type { UnknownAction } from '@reduxjs/toolkit';
import type { TIngredient, TConstructorState } from '@utils/types';

describe('burgerConstructorSlice reducer', () => {
  const initialState: TConstructorState = {
    bun: null,
    ingredients: [],
  };

  const makeIngredient = (id: string): TIngredient & { uid: string } => ({
    _id: id,
    uid: `uid-${id}`,
    name: `Ингредиент ${id}`,
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 0,
    image: '',
    image_large: '',
    image_mobile: '',
    __v: 0,
  });

  it('initializes correctly', () => {
    const state = burgerConstructorReducer(undefined, { type: '' } as UnknownAction);
    expect(state).toEqual(initialState);
  });

  it('setBun assigns bun', () => {
    const bun: TIngredient = {
      _id: 'bun1',
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

    const action = { type: setBun.type, payload: bun };
    const next = burgerConstructorReducer(initialState, action as UnknownAction);

    expect(next.bun).toEqual(bun);
  });

  it('addIngredient pushes an ingredient with uid', () => {
    const ingredient = makeIngredient('111');

    const action = { type: addIngredient.type, payload: ingredient };
    const next = burgerConstructorReducer(initialState, action as UnknownAction);

    expect(next.ingredients.length).toBe(1);
    expect(next.ingredients[0]).toEqual(ingredient);
  });

  it('removeIngredient removes by uid', () => {
    const ing1 = makeIngredient('1');
    const ing2 = makeIngredient('2');

    const initial: TConstructorState = {
      bun: null,
      ingredients: [ing1, ing2],
    };

    const action = { type: removeIngredient.type, payload: ing1.uid };
    const next = burgerConstructorReducer(initial, action as UnknownAction);

    expect(next.ingredients.length).toBe(1);
    expect(next.ingredients[0]._id).toBe('2');
  });

  it('moveIngredient reorders ingredients', () => {
    const initial: TConstructorState = {
      bun: null,
      ingredients: [makeIngredient('a'), makeIngredient('b'), makeIngredient('c')],
    };

    const action = {
      type: moveIngredient.type,
      payload: { from: 0, to: 2 },
    };

    const next = burgerConstructorReducer(initial, action as UnknownAction);

    expect(next.ingredients.map((i) => i._id)).toEqual(['b', 'c', 'a']);
  });

  it('resetConstructor resets to initial state', () => {
    const dirty: TConstructorState = {
      bun: makeIngredient('bun'),
      ingredients: [makeIngredient('x')],
    };

    const action = { type: resetConstructor.type };
    const next = burgerConstructorReducer(dirty, action as UnknownAction);

    expect(next).toEqual(initialState);
  });
});
