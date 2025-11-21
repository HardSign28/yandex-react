import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

import IngredientImage from '@components/order-card/ingredient-image/ingredient-image';

const dumpOrder = {
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa0940',
    '643d69a5c3f7b9001cfa0946',
    '643d69a5c3f7b9001cfa0949',
    '643d69a5c3f7b9001cfa093d',
  ],
};

import { useIngredientsByIds } from '@hooks/useIngredientsByIds';
import { groupIngredientsObjects } from '@utils/format';

import styles from './order-details.module.css';

/* TODO: Переименовать тут или у бургера */
const OrderDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const { ingredients } = useIngredientsByIds(dumpOrder.ingredients);
  const grouped = groupIngredientsObjects(ingredients);
  const total = ingredients.reduce((sum, item) => sum + item.price, 0);
  return (
    <main className={`${styles.main} mt-30`}>
      <div className="text_type_digits-default text-center mb-10">#{id}</div>
      <div className="text_type_main-medium mb-2">
        Black Hole Singularity острый бургер
      </div>
      <div className={`${styles.order_status} text_type_main-default mb-15`}>
        Выполнен
      </div>
      <div className="text_type_main-medium">Состав:</div>
      <div className={`${styles.ingredients} custom-scroll`}>
        {grouped.map(({ ingredient, count }) => (
          <div key={ingredient._id} className={styles.ingredient}>
            <div className={styles.ingredient_group}>
              <IngredientImage ingredient={ingredient} />
              <span className="text_type_main-default">{ingredient.name}</span>
            </div>
            <div className="text_type_digits-default price">
              {count} x {ingredient.price}
              <CurrencyIcon type="primary" />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.order_details_footer}>
        <FormattedDate
          className="text_type_main-default text_color_inactive"
          date={new Date()}
        />
        <div className={`${styles.price} text_type_digits-default`}>
          {total}
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
