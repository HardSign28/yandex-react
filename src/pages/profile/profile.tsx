import IconSpinner from '@/images/spinner.svg?react';
import { useUpdateUserMutation } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';

import type React from 'react';

import styles from './profile.module.css';

const Profile = (): React.JSX.Element => {
  const user = useAppSelector((state) => state.auth.user);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nameDisabled, setNameDisabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const dispatch = useAppDispatch();

  /**
   * Заполняем поля профиля
   */
  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword(''); // при загрузке пользователя не подставляем пароль
  }, [user]);

  /**
   * Автофокус при редактирования имени
   */
  useEffect(() => {
    if (!nameDisabled) {
      inputRef.current?.focus();
    }
  }, [nameDisabled]);

  /**
   * Снимаем disabled при клике на иконку edit
   */
  const onNameIconClick = (): void => {
    setNameDisabled(false);
  };

  /**
   * Изменение поля Имя
   * @param e
   */
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  /**
   * Изменение поля email
   * @param e
   */
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  /**
   * Изменение пароля
   * @param e
   */
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  /**
   * Возвращает измененные поля
   */
  const computeChangedFields = (): {
    name?: string;
    email?: string;
    password?: string;
  } => {
    const changed: { name?: string; email?: string; password?: string } = {};

    if (user) {
      if ((name ?? '').trim() !== (user.name ?? '').trim()) {
        changed.name = name.trim();
      }
      if ((email ?? '').trim() !== (user.email ?? '').trim()) {
        changed.email = email.trim();
      }
    } else {
      if (name.trim()) changed.name = name.trim();
      if (email.trim()) changed.email = email.trim();
    }

    if (password && password.trim().length > 0) {
      changed.password = password;
    }

    return changed;
  };

  const changedFields = computeChangedFields();
  const hasChanges = Object.keys(changedFields).length > 0;

  const onSave = async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault();
    if (!hasChanges) return;

    try {
      const updatedUser = await updateUser(changedFields).unwrap();

      dispatch(setUser(updatedUser));

      setName(updatedUser.name ?? '');
      setEmail(updatedUser.email ?? '');
      setPassword('');
      setNameDisabled(true);
    } catch (err) {
      console.error('update user failed', err);
      // можно показать уведомление пользователю
    }
  };

  /**
   * Возвращаем значения полей при отмене
   */
  const onCancel = (): void => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
    setNameDisabled(true);
  };

  return (
    <form onSubmit={(e) => void onSave(e)}>
      <Input
        type="text"
        placeholder="Имя"
        onChange={onChangeName}
        value={name}
        name="name"
        error={false}
        ref={inputRef}
        errorText="Ошибка"
        size="default"
        icon="EditIcon"
        disabled={nameDisabled}
        onIconClick={onNameIconClick}
        onBlur={() => setNameDisabled(true)}
      />

      <EmailInput
        placeholder="Логин"
        onChange={onChangeEmail}
        value={email}
        name="email"
        isIcon={true}
        extraClass="mt-6"
      />

      <PasswordInput
        onChange={onChangePassword}
        value={password}
        name="password"
        extraClass="mt-6"
        icon="EditIcon"
      />

      {hasChanges && (
        <div className={styles.profile_footer}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            extraClass="mt-6"
            onClick={onCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>

          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            extraClass={`${styles.button} button_with_spinner mt-6`}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? <IconSpinner className="button_spinner" /> : 'Сохранить'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default Profile;
