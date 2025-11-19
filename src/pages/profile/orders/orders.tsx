import { Link, useLocation } from 'react-router-dom';

import OrderCard from '@components/order-card/order-card';

import styles from './orders.module.css';

const Orders = (): React.JSX.Element => {
  const location = useLocation();
  const dump = {
    id: 1,
  };
  return (
    <>
      <div className={`${styles.orders} text text_type_main-medium`}>
        История заказов
      </div>
      <Link
        key={dump.id}
        to={`/profile/orders/${dump.id}`}
        state={{ background: location }}
        className="hidden_link"
      >
        <OrderCard />
      </Link>
    </>
  );
};

export default Orders;
