import styles from './orders.module.css';

const Orders = (): React.JSX.Element => {
  return (
    <div className={`${styles.orders} text text_type_main-medium`}>История заказов</div>
  );
};

export default Orders;
