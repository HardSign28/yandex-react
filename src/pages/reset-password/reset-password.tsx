import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './reset-password.module.css';

const ResetPassword = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };
  const onChangeConfirmCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmCode(e.target.value);
  };
  return (
    <main className="main pl-4 pr-4">
      <div className={styles.reset_password_wrapper}>
        <h1 className="text text_type_main-medium text-center">Восстановление пароля</h1>
        <PasswordInput
          placeholder="Введите новый пароль"
          onChange={onChangePassword}
          value={password}
          name={'password'}
          extraClass="mt-6"
        />
        <Input
          type={'text'}
          placeholder={'Введите код из письма'}
          onChange={onChangeConfirmCode}
          value={confirmCode}
          name={'name'}
          error={false}
          errorText={'Ошибка'}
          size={'default'}
          extraClass="mt-6"
        />
        <Button
          htmlType="button"
          type="primary"
          size="medium"
          extraClass="mt-6 margin-auto-x"
        >
          Сохранить
        </Button>
        <div className="mt-20 text text_type_main-default text_color_inactive text-center">
          <p>
            Вспомнили пароль?
            <Link className={`${styles.link} ml-2`} to="/login">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
