import { useAppSelector } from '@/store/hooks';
import { selectUser, selectIsAuthChecked } from '@/store/slices/authSlice'; // или userSlice, если у тебя иначе
import { Navigate, useLocation } from 'react-router-dom';

import type React from 'react';

type ProtectedProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component,
}: ProtectedProps): React.JSX.Element => {
  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <div>Загрузка...</div>;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  return component;
};
