import { NavLink, Outlet } from 'react-router-dom';

import styles from './profile-layout.module.css';

const ProfileLayout = (): React.JSX.Element => {
  return (
    <main className={`${styles.main} pl-4 pr-4 mt-30`}>
      <aside className={styles.aside}>
        <nav>
          <NavLink to="/profile" className="">
            Профиль
          </NavLink>
          <NavLink to="orders">История заказов</NavLink>
          <NavLink to="">Выход</NavLink>
        </nav>
        <div className="text text_type_main-default text_color_inactive">
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
