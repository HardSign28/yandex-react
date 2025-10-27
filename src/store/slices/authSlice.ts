import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TAuthState, TUser } from '@utils/types';

const initialState: TAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user?: TUser;
        accessToken?: string | null;
        refreshToken?: string | null;
      }>
    ) {
      const { user, accessToken, refreshToken } = action.payload;
      if (user) state.user = user;
      state.accessToken = accessToken ?? state.accessToken;
      state.refreshToken = refreshToken ?? state.refreshToken;
      state.isAuthenticated = !!state.accessToken;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    /*
    checkUserAuth: (state) => {
      state.isAuthenticated = !!localStorage.getItem('refreshToken');
      state.isAuthChecked = true;
    },
    */
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const { setUser, setIsAuthChecked } = authSlice.actions;
export const { selectUser, selectIsAuthChecked } = authSlice.selectors;
export default authSlice.reducer;
