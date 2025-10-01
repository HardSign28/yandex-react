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
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };
  return (
    <main className={`${styles.main} pl-4 pr-4`}>
      <div className={styles.login_wrapper}>
        <h1 className="text text_type_main-medium">Регистрация</h1>
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
          extraClass="mt-6 margin-auto-x"
        >
          Зарегистрироваться
        </Button>
        <div
          className={`${styles.login_footer} mt-20 text text_type_main-default text_color_inactive`}
        >
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
