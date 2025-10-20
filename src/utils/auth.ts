export const getAccessToken = (): string | null => localStorage.getItem('accessToken');

export const getRefreshToken = (): string | null => localStorage.getItem('refreshToken');

export const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isTokenExists = (): boolean => !!getAccessToken();
