import IconSpinner from '@/images/spinner.svg?react';

import styles from './loader.module.css';

const Loader = (): React.JSX.Element => {
  return (
    <div className={`${styles.loading} text text_type_main-medium`}>
      <IconSpinner className={styles.spinner_icon} />
      Загрузка
    </div>
  );
};

export default Loader;
