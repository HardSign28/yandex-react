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
    <div className={`${styles.main}`}>
      {(isLoading || !data?.orders) && <Loader />}
      {data && (
        <div className={`${styles.orders} custom-scroll`}>
          {data?.orders
            ?.filter((order) => order?._id && order?.number)
            .map((order) => (
              <Link
                key={order._id}
                to={`/profile/orders/${order.number}`}
                state={{ background: location }}
                className="hidden_link pr-2"
              >
                <OrderCard order={order} />
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
