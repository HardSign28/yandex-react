import { describe, it, expect } from 'vitest';
import orderReducer from '@/store/slices/orderSlice';
import type { TOrderDetails, TOrderState } from '@utils/types';

// Генерация meta для RTK Query matchers
const makeMeta = () => ({
  arg: {
    endpointName: 'createOrder',
    originalArgs: undefined,
    type: 'mutation',
  },
});

describe('orderSlice reducer', () => {
  const initialState: TOrderState = {
    last: null,
    error: null,
    isLoading: false,
  };

  it('initializes correctly', () => {
    const state = orderReducer(undefined, { type: '' } as any);
    expect(state).toEqual(initialState);
  });

  it('clearOrder resets last and error', () => {
    const dirty: TOrderState = {
      last: { name: 'test', success: true, order: { number: 1 } },
      error: 'some error',
      isLoading: false,
    };

    const action = { type: 'order/clearOrder' };
    const next = orderReducer(dirty, action as any);

    expect(next.last).toBeNull();
    expect(next.error).toBeNull();
    expect(next.isLoading).toBe(false);
  });

  it('handles createOrder.pending', () => {
    const action = {
      type: 'api/executeMutation/pending',
      meta: makeMeta(),
    };

    const next = orderReducer(initialState, action as any);

    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
    expect(next.last).toBeNull();
  });

  it('handles createOrder.fulfilled', () => {
    const payload: TOrderDetails = {
      success: true,
      name: 'Order Test',
      order: { number: 1234 },
    };

    const action = {
      type: 'api/executeMutation/fulfilled',
      payload,
      meta: makeMeta(),
    };

    const next = orderReducer(initialState, action as any);

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

    const next = orderReducer(initialState, action as any);

    expect(next.isLoading).toBe(false);
    expect(next.last).toBeNull();
    expect(next.error).toBe('Server error');
  });
});
