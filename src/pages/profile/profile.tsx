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

  // контролируемые поля
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>(''); // пустой = не менять пароль

  // локальные UI состояния
  const [nameDisabled, setNameDisabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // RTK Query mutation
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const dispatch = useAppDispatch();

  // при изменении user — заполняем локальные состояния
  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword(''); // при загрузке пользователя не подставляем пароль
  }, [user]);

  // автофокус при включении редактирования имени
  useEffect(() => {
    if (!nameDisabled) {
      inputRef.current?.focus();
    }
  }, [nameDisabled]);

  const onNameIconClick = (): void => {
    setNameDisabled(false);
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  // вычисляем какие поля изменились относительно user
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
      // если user отсутствует — отправляем поля, которые заполнены
      if (name.trim()) changed.name = name.trim();
      if (email.trim()) changed.email = email.trim();
    }

    // если пароль не пустой — включаем его (сервер ожидает поле password при смене)
    if (password && password.trim().length > 0) {
      changed.password = password;
    }

    return changed;
  };

  const changedFields = computeChangedFields();
  const hasChanges = Object.keys(changedFields).length > 0;

  const onSave = async (): Promise<void> => {
    if (!hasChanges) return; // ничего не менять

    try {
      // отправляем только изменённые поля
      const updatedUser = await updateUser(changedFields).unwrap();

      // при необходимости: можно диспатчить setUser(updated) здесь,
      // но у нас mutation инвалидирует 'Auth' и useGetUserQuery может обновиться.
      // Пример:
      // dispatch(setUser(updated))

      // сбрасываем локальный пароль поле
      dispatch(setUser(updatedUser));

      // Обновляем локальные контролы (на всякий случай / мгновенный эффект)
      setName(updatedUser.name ?? '');
      setEmail(updatedUser.email ?? '');
      setPassword('');
      setNameDisabled(true);
    } catch (err) {
      console.error('update user failed', err);
      // можно показать уведомление пользователю
    }
  };

  const onCancel = (): void => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
    setNameDisabled(true);
  };

  return (
    <div>
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
            htmlType="button"
            type="primary"
            size="medium"
            extraClass="mt-6"
            onClick={() => void onSave()}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
