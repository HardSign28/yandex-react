import { usePasswordResetConfirmMutation } from '@/store/api';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import styles from './reset-password.module.css';

const ResetPassword = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const navigate = useNavigate();
  const [passwordResetConfirm, { isLoading }] = usePasswordResetConfirmMutation();

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    setErrorText(null);
  };
  const onChangeConfirmCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmCode(e.target.value);
    setErrorText(null);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorText(null);

    // базовая валидация
    if (!password.trim()) {
      setErrorText('Введите новый пароль');
      return;
    }
    if (!confirmCode.trim()) {
      setErrorText('Введите код из письма');
      return;
    }

    try {
      const res = await passwordResetConfirm({
        password: password.trim(),
        token: confirmCode.trim(),
      }).unwrap();
      if (res?.success) {
        // очистим флаг, если вы его ставили при отправке письма
        try {
          localStorage.removeItem('resetPassword');
        } catch (_) {
          // ignore
        }
        // при успехе — перенаправляем на логин
        void navigate('/login');
      } else {
        setErrorText(res?.message ?? 'Ошибка сброса пароля');
      }
    } catch (err) {
      const error = err as FetchBaseQueryError | SerializedError;
      let msg = 'Ошибка сброса пароля';

      if ('data' in error && typeof error.data === 'object' && error.data !== null) {
        const data = error.data as Record<string, unknown>;
        if (typeof data.message === 'string') msg = data.message;
        else if (typeof data.error === 'string') msg = String(data.error);
      } else if ('error' in error && typeof error.error === 'string') {
        msg = error.error;
      }

      setErrorText(msg);
    }
  };

  /**
   * Проверяем наличие localStorage
   */
  const checkResetPassword = (): boolean => {
    return !!localStorage.getItem('resetPassword');
  };

  useEffect(() => {
    if (!checkResetPassword()) void navigate('/');
  }, []);

  return (
    <main className="main pl-4 pr-4">
      <form
        className={styles.reset_password_wrapper}
        onSubmit={(e) => void handleSubmit(e)}
      >
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
        {errorText && (
          <div className="text text_type_main-default text_color_error mt-4">
            {errorText}
          </div>
        )}
        <Button
          htmlType="button"
          type="primary"
          size="medium"
          extraClass="mt-6 margin-auto-x"
        >
          {isLoading ? 'Сохраняем...' : 'Сохранить'}
        </Button>
        <div className="mt-20 text text_type_main-default text_color_inactive text-center">
          <p>
            Вспомнили пароль?
            <Link className={`${styles.link} ml-2`} to="/login">
              Войти
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default ResetPassword;
