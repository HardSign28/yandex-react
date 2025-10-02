import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { select } from '@/store/slices/selectedIngredientSlice';
import { useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import IngredientDetails from '@components/burger-ingredients/ingredient-details/ingredient-details';
import Modal from '@components/modal/modal';
import ResetPassword from '@pages/forgot-password/reset-password';
import Home from '@pages/home/home';
import Login from '@pages/login/login';
import Register from '@pages/register/register';
import ForgotPassword from '@pages/reset-password/forgot-password';

import type { LocationState, TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation() as unknown as Location & { state?: LocationState };
  const background = location.state?.background;
  const selectedIngredient: TIngredient = useAppSelector(
    (s) => s.selectedIngredient.current
  );
  const dispatch = useAppDispatch();

  /**
   * Закрытие модалки ингредиента
   */
  const handleModalClose = useCallback(() => {
    void navigate(-1);
    dispatch(select(null));
  }, [dispatch, navigate]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path="/" element={<Home />} />
        <Route
          path="/ingredients/:ingredientId"
          element={<IngredientDetails ingredient={selectedIngredient} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/*<Route path="*" element={<NotFound404 />} />*/}
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/ingredients/:ingredientId"
            element={
              <Modal
                isOpen={!!selectedIngredient && !!background}
                labelledById="ingredient-modal-title"
                closeOnOverlay
                title="Детали ингридиента"
                onClose={handleModalClose}
              >
                <IngredientDetails ingredient={selectedIngredient} />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
