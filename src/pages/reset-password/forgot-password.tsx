import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './forgot-password.module.css';

const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };
  return (
    <main className={`${styles.main} pl-4 pr-4`}>
      <div className={styles.forgot_password_wrapper}>
        <h1 className="text text_type_main-medium text-center">Восстановление пароля</h1>
        <EmailInput
          placeholder="Укажите e-mail"
          onChange={onChangeEmail}
          value={email}
          name={'email'}
          isIcon={false}
          extraClass="mt-6"
        />
        <Button
          htmlType="button"
          type="primary"
          size="medium"
          extraClass="mt-6 margin-auto-x"
        >
          Восстановить
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

export default ForgotPassword;
