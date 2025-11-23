import { API_URL } from '@/constants/api';
import { store } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';

export const refreshTokenWS = async (): Promise<string | null> => {
  const state = store.getState();
  const refreshToken = state.auth.refreshToken ?? localStorage.getItem('refreshToken');

  try {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!response.ok) throw new Error('Failed');

    const data = (await response.json()) as {
      accessToken: string;
      refreshToken: string;
    };

    store.dispatch(
      setCredentials({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
    );

    return data.accessToken.replace(/^Bearer\s+/, '');
  } catch {
    return null;
  }
};
