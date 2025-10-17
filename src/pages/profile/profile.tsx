import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';

import styles from './profile.module.css';

const Profile = (): React.JSX.Element => {
  const [name, setName] = useState('Космос');
  const [nameDisabled, setNameDisabled] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!nameDisabled) {
      inputRef.current?.focus();
    }
  }, [nameDisabled]);

  const onNameIconClick = (): void => {
    setNameDisabled(false);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };
  return (
    <div>
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
        icon="EditIcon"
        disabled={nameDisabled}
        onIconClick={onNameIconClick}
        onBlur={() => setNameDisabled(true)}
      />
      <EmailInput
        placeholder="Логин"
        onChange={onChangeEmail}
        value={email}
        name={'email'}
        isIcon={true}
        extraClass="mt-6"
      />
      <PasswordInput
        onChange={onChangePassword}
        value={password}
        name={'password'}
        extraClass="mt-6"
        icon="EditIcon"
      />
      <div className={styles.profile_footer}>
        <Button htmlType="button" type="secondary" size="medium" extraClass="mt-6">
          Отмена
        </Button>
        <Button htmlType="button" type="primary" size="medium" extraClass="mt-6">
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default Profile;
