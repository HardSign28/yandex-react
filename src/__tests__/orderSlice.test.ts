import orderReducer, { initialState } from '@/store/slices/orderSlice';
import { describe, it, expect } from 'vitest';

import type { UnknownAction } from '@reduxjs/toolkit';
import type { TOrderDetails, TOrderState } from '@utils/types';

type TestMeta = {
  arg: {
    endpointName: string;
    originalArgs: unknown;
    type: string;
  };
};

const makeMeta = (): TestMeta => ({
  arg: {
    endpointName: 'createOrder',
    originalArgs: undefined,
    type: 'mutation',
  },
});

describe('orderSlice reducer', () => {
  it('initializes correctly', () => {
    const state = orderReducer(undefined, { type: '' } as UnknownAction);
    expect(state).toEqual(initialState);
  });

  it('clearOrder resets last and error', () => {
    const dirty: TOrderState = {
      last: { name: 'test', success: true, order: { number: 1 } },
      error: 'some error',
      isLoading: false,
    };

    const action = { type: 'order/clearOrder' };
    const next = orderReducer(dirty, action as UnknownAction);

    expect(next.last).toBeNull();
    expect(next.error).toBeNull();
    expect(next.isLoading).toBe(false);
  });

  it('handles createOrder.pending', () => {
    const action = {
      type: 'api/executeMutation/pending',
      meta: makeMeta(),
    };

    const next = orderReducer(initialState, action as UnknownAction);

    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
    expect(next.last).toBeNull();
  });

  it('handles createOrder.fulfilled', () => {
    const payload: TOrderDetails = {
      success: true,
      name: 'Тестовый заказ',
      order: { number: 1234 },
    };

    const action = {
      type: 'api/executeMutation/fulfilled',
      payload,
      meta: makeMeta(),
    };

    const next = orderReducer(initialState, action as UnknownAction);

    expect(next.isLoading).toBe(false);
    expect(next.last).toEqual(payload);
    expect(next.error).toBeNull();
  });

  it('handles createOrder.rejected', () => {
    const action = {
      type: 'api/executeMutation/rejected',
      error: { message: 'Server error' },
      meta: makeMeta(),
    };

    const next = orderReducer(initialState, action as UnknownAction);

    expect(next.isLoading).toBe(false);
    expect(next.last).toBeNull();
    expect(next.error).toBe('Server error');
  });
});
