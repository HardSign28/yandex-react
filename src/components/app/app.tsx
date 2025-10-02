import { Routes, Route } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import ResetPassword from '@pages/forgot-password/reset-password';
import Home from '@pages/home/home';
import Login from '@pages/login/login';
import Register from '@pages/register/register';
import ForgotPassword from '@pages/reset-password/forgot-password';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
