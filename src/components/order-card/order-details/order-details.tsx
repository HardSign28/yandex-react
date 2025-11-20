import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

import IngredientImage from '@components/order-card/ingredient-image/ingredient-image';
import { ingredients } from '@utils/ingredients';

import styles from './order-details.module.css';

/* TODO: Переименовать тут или у бургера */
const OrderDetails = (): React.JSX.Element => {
  const { id } = useParams();
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
      <div className="">
        <IngredientImage ingredient={ingredients[14]} />
        <IngredientImage ingredient={ingredients[12]} />
        <IngredientImage ingredient={ingredients[5]} />
        <IngredientImage ingredient={ingredients[7]} />
      </div>
      <div className={styles.order_details_footer}>
        <FormattedDate
          className="text_type_main-default text_color_inactive"
          date={new Date()}
        />
        <div className={`${styles.price} text_type_digits-default`}>
          510
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
