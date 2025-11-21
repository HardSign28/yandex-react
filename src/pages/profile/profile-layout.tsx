import { useLogoutMutation } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { NavLink, Outlet } from 'react-router-dom';

import styles from './profile-layout.module.css';

const ProfileLayout = (): React.JSX.Element => {
  const [logoutApi] = useLogoutMutation();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const dispatch = useAppDispatch();
  /**
   * Нажатие на кнопку Выход
   */
  const onLogout = async (): Promise<void> => {
    try {
      if (refreshToken) {
        await logoutApi(refreshToken).unwrap();
      }
    } finally {
      dispatch(logout());
    }
  };
  return (
    <main className={`${styles.main} pl-4 pr-4`}>
      <aside className={`${styles.aside} mt-30`}>
        <nav>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `text text_type_main-medium link mt-4 mb-7 ${isActive ? 'link_active' : ''}`
            }
          >
            Профиль
          </NavLink>
          <NavLink
            to="orders"
            className={({ isActive }) =>
              `text text_type_main-medium link mt-4 mb-7 ${isActive ? 'link_active' : ''}`
            }
          >
            История заказов
          </NavLink>
          <NavLink
            to=""
            onClick={() => void onLogout()}
            className="text text_type_main-medium link mt-4 mb-7"
          >
            Выход
          </NavLink>
        </nav>
        <div
          className={`${styles.description} text text_type_main-default text_color_inactive mt-30`}
        >
          В этом разделе вы можете
          <br />
          изменить свои персональные данные
        </div>
      </aside>
      <div className="ml-15">
        <Outlet />
      </div>
    </main>
  );
};

export default ProfileLayout;
