import iconOrderDetails from '@/images/icon-order-details.svg';

import type { TOrderDetails } from '@utils/types';

import styles from './order-details.module.css';

const OrderDetails = ({
  orderDetails,
}: {
  orderDetails: TOrderDetails | null;
}): React.JSX.Element => {
  return (
    <div className={`${styles.order_details} mt-8 mb-20`}>
      <div className={`${styles.order_details_number} text text_type_digits-large`}>
        {orderDetails?.order.number}
      </div>
      <div className="text text_type_main-medium mt-8">идентификатор заказа</div>
      <img
        src={iconOrderDetails}
        className={`${styles.order_details_icon} mt-15`}
        alt="iconOrderDetails"
      ></img>
      <div className="text text_type_main-default mt-15">Ваш заказ начали готовить</div>
      <div className="text text_type_main-default text_color_inactive mt-2">
        Дождитесь готовности на орбитальной станции
      </div>
    </div>
  );
};

export default OrderDetails;
