import IconSpinner from '@/images/spinner.svg?react';
import { usePasswordResetMutation } from '@/store/api';
import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type React from 'react';

import styles from './forgot-password.module.css';

const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const navigate = useNavigate();

  const [passwordReset, { isLoading }] = usePasswordResetMutation();

  /**
   * Изменение поля email
   * @param e
   */
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    setErrorText(null);
  };

  /**
   * Сабмит формы
   * @param e
   */
  const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault();
    setErrorText(null);

    if (!email.trim()) {
      setErrorText('Введите email');
      return;
    }

    try {
      const res = await passwordReset({
        email: email.trim(),
      }).unwrap();
      if (res?.success) {
        void navigate('/reset-password');
        localStorage.setItem('resetPassword', '1');
      } else {
        setErrorText(res?.message ?? 'Неизвестная ошибка');
      }
    } catch (err) {
      const error = err as FetchBaseQueryError | SerializedError;
      let msg = 'Ошибка отправки письма';

      if ('data' in error && typeof error.data === 'object' && error.data !== null) {
        const data = error.data as Record<string, unknown>;
        if (typeof data.message === 'string') msg = data.message;
        else if (typeof data.error === 'string') msg = data.error;
      } else if ('error' in error && typeof error.error === 'string') {
        msg = error.error;
      }

      setErrorText(msg);
    }
  };

  return (
    <main className="main pl-4 pr-4">
      <form className="auth_page_wrapper" onSubmit={(e) => void handleSubmit(e)}>
        <h1 className="text text_type_main-medium text-center">Восстановление пароля</h1>

        <EmailInput
          placeholder="Укажите e-mail"
          onChange={onChangeEmail}
          value={email}
          name="email"
          isIcon={false}
          extraClass="mt-6"
        />

        {errorText && (
          <div className="text text_type_main-default text_color_error mt-4">
            {errorText}
          </div>
        )}

        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass={`${styles.button} button_with_spinner mt-6 margin-auto-x`}
          disabled={isLoading}
        >
          {isLoading ? <IconSpinner className="button_spinner" /> : 'Восстановить'}
        </Button>

        <div className="mt-20 text text_type_main-default text_color_inactive text-center">
          <p>
            Вспомнили пароль?
            <Link className="auth_link ml-2" to="/login">
              Войти
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default ForgotPassword;
