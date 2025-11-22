import { makeSelectOrderByNumber } from '@/selectors/ordersSelectors';
import { useGetOrderByNumberQuery } from '@/store/api';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { skipToken } from '@reduxjs/toolkit/query';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import Loader from '@components/loader/loader';
import IngredientImage from '@components/order-card/ingredient-image/ingredient-image';
import { useIngredientsByIds } from '@hooks/useIngredientsByIds';
import { getAccessToken } from '@utils/auth';
import { formatThousands, groupIngredientsObjects } from '@utils/format';
import {
  OrderStatus,
  type TLocationStateBackground,
  type TOrdersWSResponse,
} from '@utils/types';

import styles from './order-details.module.css';

const OrderDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const orderNumber = Number(id);

  const accessToken = getAccessToken()?.replace('Bearer ', '') ?? '';

  const wsOrder = useSelector(makeSelectOrderByNumber(orderNumber, accessToken));

  const { data: apiOrder, isLoading } = useGetOrderByNumberQuery(
    wsOrder ? skipToken : orderNumber
  );

  const location = useLocation() as unknown as Location & {
    state?: TLocationStateBackground;
  };

  const background = !!location.state?.background;

  const apiResolved = apiOrder as TOrdersWSResponse | undefined;

  const order = wsOrder ?? apiResolved?.orders?.[0] ?? null;

  const { ingredients } = useIngredientsByIds(order?.ingredients ?? []);
  const grouped = groupIngredientsObjects(ingredients);
  const total = ingredients.reduce((sum, item) => sum + item.price, 0);

  if (!order || isLoading) return <Loader />;

  return (
    <main className={`${styles.main} ${!background ? 'mt-30' : ''} `}>
      <div
        className={`text_type_digits-default mb-10 ${!background ? 'text-center' : ''}`}
      >
        #{id}
      </div>
      <div className="text_type_main-medium mb-2">{order.name}</div>
      <div className={`${styles.order_status} text_type_main-default mb-15`}>
        {OrderStatus[order.status]}
      </div>
      <div className="text_type_main-medium mb-6">Состав:</div>
      <div className={`${styles.ingredients} custom-scroll`}>
        {grouped.map(({ ingredient, count }) => (
          <div key={ingredient._id} className={styles.ingredient}>
            <div className={styles.ingredient_group}>
              <IngredientImage ingredient={ingredient} />
              <span className="text_type_main-default">{ingredient.name}</span>
            </div>
            <div className="text_type_digits-default price">
              {count} x {formatThousands(ingredient.price)}
              <CurrencyIcon type="primary" />
            </div>
          </div>
        ))}
      </div>
      <div className={`${styles.order_details_footer} mt-10`}>
        <FormattedDate
          className="text_type_main-default text_color_inactive"
          date={new Date()}
        />
        <div className={`${styles.price} text_type_digits-default`}>
          {formatThousands(total)}
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
