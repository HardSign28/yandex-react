import { useFeedOrdersQuery } from '@/store/thunks/wsApi';
import { formatThousands } from '@/utils/format';
import { Link, useLocation } from 'react-router-dom';

import Loader from '@components/loader/loader';
import OrderCard from '@components/order-card/order-card';

import styles from './feed.module.css';
const Feed = (): React.JSX.Element => {
  const location = useLocation();
  const { data, isLoading } = useFeedOrdersQuery();

  const total = data?.total;
  const totalToday = data?.totalToday;
  const limit = 20;
  const doneOrders =
    data?.orders?.filter((o) => o.status === 'done').slice(0, limit) ?? [];
  const pendingOrders =
    data?.orders?.filter((o) => o.status === 'pending').slice(0, limit) ?? [];

  return (
    <div className="container">
      <h1 className="text_type_main-large mt-10 mb-5 pl-4">Лента заказов</h1>
      <main className={`${styles.main} pl-4 pr-4 pb-10`}>
        {isLoading && <Loader />}
        {data && (
          <>
            <div className={`${styles.feed_orders} custom-scroll`}>
              {data?.orders
                ?.filter((order) => order?._id && order?.number)
                .map((order) => (
                  <Link
                    key={order._id}
                    to={`/feed/${order.number}`}
                    state={{ background: location }}
                    className="hidden_link"
                  >
                    <OrderCard order={order} />
                  </Link>
                ))}
            </div>
            <div className={styles.feed_summary}>
              <div className={`${styles.orders_status} mb-15`}>
                <div>
                  <div className="text_type_main-medium mb-6">Готовы:</div>
                  <div className={`${styles.done} text_type_digits-default`}>
                    {doneOrders.map((order, index) => (
                      <div key={index}>{order.number}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text_type_main-medium mb-6">В работе:</div>
                  <div className={`${styles.pending} text_type_digits-default`}>
                    {pendingOrders.map((order, index) => (
                      <div key={index}>{order.number}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-15">
                <div className="text_type_main-medium">Выполнено за все время:</div>
                <div className="digits_shadow text_type_digits-large">
                  {formatThousands(Number(total) || 0)}
                </div>
              </div>
              <div className="mb-15">
                <div className="text_type_main-medium">Выполнено за сегодня:</div>
                <div className="digits_shadow text_type_digits-large">
                  {formatThousands(Number(totalToday) || 0)}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Feed;
