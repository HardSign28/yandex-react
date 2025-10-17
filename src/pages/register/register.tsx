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

import styles from './register.module.css';

const Register = (): React.JSX.Element => {
  const [name, setName] = useState('Космос');
  const [password, setPassword] = useState('password');
  const [email, setEmail] = useState('demo@test.kz');
  const inputRef = useRef(null);
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const onRegister = async (): Promise<void> => {
    const res = await register({
      email,
      password,
      name,
    }).unwrap();
    const accessToken = res.accessToken?.replace('Bearer ', '') ?? '';
    const refreshToken = res.refreshToken ?? '';
    dispatch(setCredentials({ user: res.user, accessToken, refreshToken }));
  };

  return (
    <main className="main pl-4 pr-4">
      <div className={styles.register_wrapper}>
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
          htmlType="button"
          type="primary"
          size="medium"
          extraClass={`${styles.button} button_with_spinner mt-6 margin-auto-x`}
          onClick={() => void onRegister()}
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
      </div>
    </main>
  );
};

export default Register;
