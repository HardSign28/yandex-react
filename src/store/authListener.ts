import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { setCredentials, logout } from './slices/authSlice';

const authListener = createListenerMiddleware();

authListener.startListening({
  matcher: isAnyOf(setCredentials, logout),
  effect: (action) => {
    if (setCredentials.match(action)) {
      const { refreshToken, accessToken } = action.payload;
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (accessToken) localStorage.setItem('accessToken', accessToken);
    }

    if (logout.match(action)) {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
    }
  },
});

export default authListener;
