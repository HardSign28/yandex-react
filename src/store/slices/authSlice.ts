import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TAuthState, TUser } from '@utils/types';

const initialState: TAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
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
      state.isAuthenticated = Boolean(state.accessToken);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
