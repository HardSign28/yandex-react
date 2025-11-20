import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';

import IngredientImage from '@components/order-card/ingredient-image/ingredient-image';
import { ingredients } from '@utils/ingredients';

import styles from './order-card.module.css';
const OrderCard = (): React.JSX.Element => {
  return (
    <div className={`${styles.order_card} p-6`}>
      <div className={`${styles.order_card_header} mb-6`}>
        <div className="text_type_digits-default">#034535</div>
        <FormattedDate
          className="text_type_main-default text_color_inactive"
          date={new Date()}
        />
      </div>
      <div className="text_type_main-medium mb-6">Death Star Starship Main бургер</div>
      <div className={styles.order_card_footer}>
        <div className={styles.order_card_ingredients}>
          <IngredientImage
            className={styles.order_card_ingredient}
            ingredient={ingredients[14]}
          />
          <IngredientImage
            className={styles.order_card_ingredient}
            ingredient={ingredients[12]}
          />
          <IngredientImage
            className={styles.order_card_ingredient}
            ingredient={ingredients[10]}
          />
          <IngredientImage
            className={styles.order_card_ingredient}
            ingredient={ingredients[8]}
          />
          <IngredientImage
            className={styles.order_card_ingredient}
            ingredient={ingredients[5]}
          />
          <IngredientImage
            className={styles.order_card_ingredient}
            ingredient={ingredients[13]}
            value="+3"
          />
        </div>
        <div className={`${styles.order_card_price} text_type_digits-default`}>
          480
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
