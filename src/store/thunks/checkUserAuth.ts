import { api } from '@/store/api';
import { setUser, setIsAuthChecked } from '@/store/slices/authSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getRefreshToken } from '@utils/auth';

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      dispatch(setIsAuthChecked(true));
      return;
    }

    try {
      const result = await dispatch(api.endpoints.getUser.initiate());
      if (result?.data) {
        dispatch(setUser(result.data));
      }
    } catch {
      localStorage.removeItem('refreshToken');
    } finally {
      dispatch(setIsAuthChecked(true));
    }
  }
);
