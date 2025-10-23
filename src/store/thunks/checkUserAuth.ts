import { createAsyncThunk } from '@reduxjs/toolkit';
import { setUser, setIsAuthChecked } from '../slices/authSlice';
import { api } from '../api'; // где у тебя api

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      dispatch(setIsAuthChecked(true));
      return;
    }

    try {
      const result = await dispatch(api.endpoints.getUser.initiate());
      console.log('result.data.user', result)
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
