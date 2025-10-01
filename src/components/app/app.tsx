import { Routes, Route } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import Home from '@pages/home/home';
import Login from '@pages/login/login';
import Register from '@pages/register/register';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
