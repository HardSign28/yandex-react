import IconSpinner from '@/images/spinner.svg?react';
import { useRegisterMutation } from '@/store/api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './register.module.css';

const Register = (): React.JSX.Element => {
  const [name, setName] = useState('Космос');
  const [password, setPassword] = useState('password');
  const [email, setEmail] = useState('demo@test.kz');
  const inputRef = useRef(null);
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
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
  const onRegister = async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault();
    const res = await register({
      email,
      password,
      name,
    }).unwrap();
    const accessToken = res.accessToken ?? '';
    const refreshToken = res.refreshToken ?? '';
    dispatch(setCredentials({ user: res.user, accessToken, refreshToken }));
  };

  return (
    <main className="main pl-4 pr-4">
      <form className={styles.register_wrapper} onSubmit={(e) => void onRegister(e)}>
        <h1 className="text text_type_main-medium text-center">Регистрация</h1>
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
          extraClass="mt-6"
        />
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
          {isLoading ? <IconSpinner className="button_spinner" /> : 'Зарегистрироваться'}
        </Button>
        <div className="mt-20 text text_type_main-default text_color_inactive text-center">
          <p>
            Уже зарегистрированы?
            <Link className={`${styles.link} ml-2`} to="/login">
              Войти
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default Register;
