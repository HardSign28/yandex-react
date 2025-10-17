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
import { Link } from 'react-router-dom';

import styles from './login.module.css';

const Login = (): React.JSX.Element => {
  const [password, setPassword] = useState('password');
  const [email, setEmail] = useState('demo@test.kz');
  const [login, { isLoading, data, error }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const onSubmit = async (): Promise<void> => {
    const res = await login({
      email,
      password,
    }).unwrap();
    // res должен содержать accessToken, refreshToken и user (проверьте структуру API)
    const accessToken = res.accessToken?.replace('Bearer ', '') ?? '';
    const refreshToken = res.refreshToken ?? '';
    dispatch(setCredentials({ user: res.user, accessToken, refreshToken }));
    console.log('data', data);
    console.log('error', error);
    // дальше редирект и т.д.
  };

  return (
    <main className="main pl-4 pr-4">
      <div className={styles.login_wrapper}>
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
          htmlType="button"
          type="primary"
          size="medium"
          extraClass={`${styles.button} button_with_spinner mt-6 margin-auto-x`}
          onClick={() => void onSubmit()}
        >
          {isLoading ? <IconSpinner className="button_spinner" /> : 'Войти'}
        </Button>
        <div className="mt-20 text text_type_main-default text_color_inactive text-center">
          <p>
            Вы - новый пользователь?
            <Link className={`${styles.link} ml-2`} to="/register">
              Зарегистрироваться
            </Link>
          </p>
          <p>
            Забыли пароль?
            <Link className={`${styles.link} ml-2`} to="/forgot-password">
              Восстановить пароль
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
