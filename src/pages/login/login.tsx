import IconSpinner from '@/images/spinner.svg?react';
import { useLoginMutation } from '@/store/api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './login.module.css';

const Login = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  /**
   * Изменение пароля
   * @param e
   */
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  /**
   * Изменение поля email
   * @param e
   */
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  /**
   * Сабмит формы
   */
  const onSubmit = async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault();
    const res = await login({
      email,
      password,
    }).unwrap();
    const accessToken = res.accessToken ?? '';
    const refreshToken = res.refreshToken ?? '';
    dispatch(setCredentials({ user: res.user, accessToken, refreshToken }));
    await navigate('/');
  };

  return (
    <div className="container">
      <main className="main pl-4 pr-4 pt-5 pb-5">
        <form className="auth_page_wrapper" onSubmit={(e) => void onSubmit(e)}>
          <h1 className="text text_type_main-medium text-center">Вход</h1>
          <EmailInput
            onChange={onChangeEmail}
            value={email}
            name={'email'}
            isIcon={false}
            extraClass="mt-6"
          />
          <PasswordInput
            onChange={onChangePassword}
            value={password}
            name={'password'}
            extraClass="mt-6"
          />
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            extraClass={`${styles.button} button_with_spinner mt-6 margin-auto-x`}
          >
            {isLoading ? <IconSpinner className="button_spinner" /> : 'Войти'}
          </Button>
          <div className="mt-20 text text_type_main-default text_color_inactive text-center">
            <p>
              Вы - новый пользователь?
              <Link className="auth_link ml-2" to="/register">
                Зарегистрироваться
              </Link>
            </p>
            <p>
              Забыли пароль?
              <Link className="auth_link ml-2" to="/forgot-password">
                Восстановить пароль
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
