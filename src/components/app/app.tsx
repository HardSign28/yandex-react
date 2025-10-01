import { Routes, Route } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import Home from '@pages/home.tsx';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
