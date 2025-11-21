import { useUserOrdersQuery } from '@/store/thunks/wsApi';
import { Link, useLocation } from 'react-router-dom';

import Loader from '@components/loader/loader';
import OrderCard from '@components/order-card/order-card';

import styles from './orders.module.css';

const Orders = (): React.JSX.Element => {
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken')?.replace('Bearer ', '');

  const { data, isLoading } = useUserOrdersQuery(accessToken!, {
    skip: !accessToken,
  });

  return (
    <>
      <div className={`${styles.orders} text text_type_main-medium`}>
        История заказов
      </div>

      {isLoading && <Loader />}
      {data && (
        <>
          {data?.orders?.map((order) => (
            <Link
              key={order._id}
              to={`/feed/${order.number}`}
              state={{ background: location }}
              className="hidden_link"
            >
              <OrderCard order={order} />
            </Link>
          ))}
        </>
      )}
    </>
  );
};

export default Orders;
