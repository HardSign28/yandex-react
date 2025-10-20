import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { setCredentials, logout } from './slices/authSlice';

const authListener = createListenerMiddleware();

authListener.startListening({
  matcher: isAnyOf(setCredentials, logout),
  effect: (action) => {
    if (setCredentials.match(action)) {
      const { refreshToken } = action.payload;
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    }

    if (logout.match(action)) {
      localStorage.removeItem('refreshToken');
    }
  },
});

export default authListener;
