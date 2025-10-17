import { NavLink, Outlet } from 'react-router-dom';

import styles from './profile-layout.module.css';

const ProfileLayout = (): React.JSX.Element => {
  return (
    <main className={`${styles.main} pl-4 pr-4 mt-30`}>
      <aside className={styles.aside}>
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
          <NavLink to="" className="text text_type_main-medium link mt-4 mb-7">
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
