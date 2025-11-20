import { Link, useLocation } from 'react-router-dom';

import OrderCard from '@components/order-card/order-card';

import styles from './feed.module.css';
const Feed = (): React.JSX.Element => {
  const location = useLocation();
  const dump = {
    id: '034533',
  };
  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-4`}>
        Лента заказов
      </h1>
      <main className={`${styles.main} pl-4 pr-4`}>
        <div className={styles.feed_orders}>
          <Link
            key={dump.id}
            to={`/feed/${dump.id}`}
            state={{ background: location }}
            className="hidden_link"
          >
            <OrderCard />
          </Link>
        </div>
        <div className={styles.feed_summary}>
          <div className={`${styles.orders_status} mb-15`}>
            <div>
              <div className="text_type_main-medium mb-6">Готовы:</div>
              <ul className={`${styles.done} text_type_digits-default`}>
                <li className="mb-2">034533</li>
                <li className="mb-2">034532</li>
                <li className="mb-2">034530</li>
                <li className="mb-2">034527</li>
                <li className="mb-2">034525</li>
              </ul>
            </div>
            <div>
              <div className="text_type_main-medium mb-6">В работе:</div>
              <ul className={`${styles.in_process} text_type_digits-default`}>
                <li className="mb-2">034538</li>
                <li className="mb-2">034541</li>
                <li className="mb-2">034542</li>
              </ul>
            </div>
          </div>
          <div className="mb-15">
            <div className="text_type_main-medium">Выполнено за все время:</div>
            <div className="digits_shadow text_type_digits-large">28 752</div>
          </div>
          <div className="mb-15">
            <div className="text_type_main-medium">Выполнено за сегодня:</div>
            <div className="digits_shadow text_type_digits-large">138</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Feed;
