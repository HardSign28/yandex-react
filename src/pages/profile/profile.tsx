import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './profile.module.css';
const Profile = (): React.JSX.Element => {
  const [name, setName] = useState('Космос');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const inputRef = useRef(null);
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };
  return (
    <main className={`${styles.main} pl-4 pr-4 mt-30`}>
      <aside className={styles.aside}>
        <nav>
          <NavLink to="/profile" className="">
            Профиль
          </NavLink>
          <NavLink to="">История заказов</NavLink>
          <NavLink to="">Выход</NavLink>
        </nav>
        <div className="text text_type_main-default text_color_inactive">
          В этом разделе вы можете
          <br />
          изменить свои персональные данные
        </div>
      </aside>
      <div className="ml-15">
        <Input
          type={'text'}
          placeholder={'Имя'}
          onChange={(e) => setName(e.target.value)}
          value={name}
          name={'name'}
          error={false}
          ref={inputRef}
          errorText={'Ошибка'}
          size={'default'}
          icon="EditIcon"
        />
        <EmailInput
          placeholder="Логин"
          onChange={onChangeEmail}
          value={email}
          name={'email'}
          isIcon={true}
          extraClass="mt-6"
        />
        <PasswordInput
          onChange={onChangePassword}
          value={password}
          name={'password'}
          extraClass="mt-6"
          icon="EditIcon"
        />
        <div className={styles.profile_footer}>
          <Button htmlType="button" type="secondary" size="medium" extraClass="mt-6">
            Отмена
          </Button>
          <Button htmlType="button" type="primary" size="medium" extraClass="mt-6">
            Сохранить
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Profile;
