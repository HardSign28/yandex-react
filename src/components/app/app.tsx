import { useSelectedIngredient } from '@/hooks/useSelectedIngredient';
import { useAppDispatch } from '@/store/hooks';
import { select } from '@/store/slices/selectedIngredientSlice';
import { checkUserAuth } from '@/store/thunks/checkUserAuth';
import { useCallback, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import IngredientDetails from '@components/burger-ingredients/ingredient-details/ingredient-details';
import Loader from '@components/loader/loader';
import Modal from '@components/modal/modal';
import OrderDetails from '@components/order-card/order-details/order-details';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import Feed from '@pages/feed/feed';
import ForgotPassword from '@pages/forgot-password/forgot-password';
import Home from '@pages/home/home';
import Login from '@pages/login/login';
import NotFound from '@pages/not-found/not-found';
import Orders from '@pages/profile/orders/orders';
import Profile from '@pages/profile/profile';
import ProfileLayout from '@pages/profile/profile-layout';
import Register from '@pages/register/register';
import ResetPassword from '@pages/reset-password/reset-password';

import type { TLocationStateBackground } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation() as unknown as Location & {
    state?: TLocationStateBackground;
  };
  const background = location.state?.background;

  const dispatch = useAppDispatch();

  const { ingredient: selectedIngredient, loading } = useSelectedIngredient();

  /**
   * Закрытие модалки ингредиента
   */
  const handleModalClose = useCallback(() => {
    void navigate(-1);
    dispatch(select(null));
  }, [dispatch, navigate]);

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={<ProtectedRoute component={<ProfileLayout />} />}
        >
          <Route index element={<Profile />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route
          path="/profile/orders/:id"
          element={<ProtectedRoute component={<OrderDetails />} />}
        />
        <Route
          path="/ingredients/:ingredientId"
          element={
            selectedIngredient ? (
              <IngredientDetails ingredient={selectedIngredient} />
            ) : loading ? (
              <Loader />
            ) : (
              <div>Ингредиент не найден.</div>
            )
          }
        />
        <Route
          path="/login"
          element={<ProtectedRoute onlyUnAuth component={<Login />} />}
        />
        <Route
          path="/register"
          element={<ProtectedRoute onlyUnAuth component={<Register />} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:id" element={<OrderDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:ingredientId"
            element={
              <Modal
                isOpen={!!background}
                labelledById="ingredient-modal-title"
                closeOnOverlay
                title="Детали ингридиента"
                onClose={handleModalClose}
              >
                {selectedIngredient ? (
                  <IngredientDetails ingredient={selectedIngredient} />
                ) : loading ? (
                  <Loader />
                ) : (
                  <div>Ингредиент не найден.</div>
                )}
              </Modal>
            }
          />
          <Route
            path="/feed/:id"
            element={
              <Modal isOpen={!!background} closeOnOverlay onClose={handleModalClose}>
                <OrderDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:id"
            element={
              <Modal isOpen={!!background} closeOnOverlay onClose={handleModalClose}>
                <OrderDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
