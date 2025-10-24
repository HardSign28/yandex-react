import { useAppSelector } from '@/store/hooks';
import { selectUser, selectIsAuthChecked } from '@/store/slices/authSlice';
import { Navigate, useLocation } from 'react-router-dom';

import Loader from '@components/loader/loader';

import type { TLocationStateFrom, TProtectedProps } from '@utils/types';
import type React from 'react';

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component,
}: TProtectedProps): React.JSX.Element => {
  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const location = useLocation() as unknown as Location & { state?: TLocationStateFrom };

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  return component;
};
