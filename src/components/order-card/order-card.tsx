import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMatch } from 'react-router-dom';

import IngredientsShort from '@components/order-card/ingredients-short/ingredients-short';
import { useIngredientsByIds } from '@hooks/useIngredientsByIds';
import { formatThousands } from '@utils/format.ts';
import { OrderStatus } from '@utils/types';

import type { TOrderCardProps } from '@utils/types';

import styles from './order-card.module.css';

const OrderCard = ({ order }: TOrderCardProps): React.JSX.Element => {
  const { ingredients } = useIngredientsByIds(order.ingredients);

  const match = useMatch('/profile/orders');
  const isDone = order.status === 'done';
  const total = ingredients.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className={`${styles.order_card} p-6`}>
      <div className={`${styles.order_card_header} mb-6`}>
        <div className="text_type_digits-default">#{order?.number}</div>
        <FormattedDate
          className="text_type_main-default text_color_inactive"
          date={new Date(order?.createdAt)}
        />
      </div>
      <div className={`text_type_main-medium ${!match ? 'mb-6' : 'mb-2'}`}>
        {order?.name}
      </div>
      {match && (
        <div
          className={`text_type_main-default mb-6 ${isDone ? styles.order_done : ''}`}
        >
          {OrderStatus[order.status]}
        </div>
      )}
      <div className={styles.order_card_footer}>
        <div className={styles.order_card_ingredients}>
          <IngredientsShort ingredients={ingredients} />
        </div>
        <div className={`${styles.order_card_price} text_type_digits-default`}>
          {formatThousands(total)}
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
