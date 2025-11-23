import { describe, it, expect } from 'vitest';
import authReducer, {
  setCredentials,
  logout,
  setUser,
  setIsAuthChecked,
} from '@/store/slices/authSlice';

import type { TAuthState, TUser } from '@utils/types';

describe('authSlice reducer', () => {
  const initialState: TAuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isAuthChecked: false,
  };

  it('initializes correctly', () => {
    const state = authReducer(undefined, { type: '' } as any);
    expect(state).toEqual(initialState);
  });

  it('setCredentials sets tokens and user', () => {
    const mockUser: TUser = {
      name: 'Vlad',
      email: 'vlad@example.com',
    } as any;

    const action = {
      type: setCredentials.type,
      payload: {
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    };

    const state = authReducer(initialState, action as any);

    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe('access-token');
    expect(state.refreshToken).toBe('refresh-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('setUser updates only user', () => {
    const mockUser: TUser = {
      name: 'Anna',
      email: 'anna@example.com',
    } as any;

    const action = { type: setUser.type, payload: mockUser };

    const state = authReducer(initialState, action as any);

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
  });

  it('setIsAuthChecked sets the flag', () => {
    const action = {
      type: setIsAuthChecked.type,
      payload: true,
    };

    const state = authReducer(initialState, action as any);

    expect(state.isAuthChecked).toBe(true);
  });

  it('logout resets authentication state', () => {
    const loggedState: TAuthState = {
      user: { name: 'X' } as any,
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
      isAuthChecked: true,
    };

    const action = { type: logout.type };

    const state = authReducer(loggedState, action as any);

    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
