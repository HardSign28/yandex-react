import { setCredentials, logout } from '@/store/slices/authSlice';
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { clearTokens } from '@utils/auth';

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
      clearTokens();
    }
  },
});

export default authListener;
