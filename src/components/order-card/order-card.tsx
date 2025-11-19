import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import styles from './order-card.module.css';
const OrderCard = (): React.JSX.Element => {
  const location = useLocation();
  const dump = {
    id: 1,
  };
  return (
    <Link
      key={dump.id}
      to={`/feed/${dump.id}`}
      state={{ background: location }}
      className={styles.link}
    >
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
          <ul className={styles.order_card_ingredients}>
            <li className={styles.order_card_ingredient}>
              <div className={styles.ingredient_background}>
                <img
                  className={styles.ingredient_img}
                  src="https://code.s3.yandex.net/react/code/bun-01.png"
                />
              </div>
            </li>
            <li className={styles.order_card_ingredient}>
              <div className={styles.ingredient_background}>
                <img
                  className={styles.ingredient_img}
                  src="https://code.s3.yandex.net/react/code/meat-03.png"
                />
              </div>
            </li>
            <li className={styles.order_card_ingredient}>
              <div className={styles.ingredient_background}>
                <img
                  className={styles.ingredient_img}
                  src="https://code.s3.yandex.net/react/code/core.png"
                />
              </div>
            </li>
            <li className={styles.order_card_ingredient}>
              <div className={styles.ingredient_background}>
                <img
                  className={styles.ingredient_img}
                  src="https://code.s3.yandex.net/react/code/mineral_rings.png"
                />
              </div>
            </li>
            <li className={styles.order_card_ingredient}>
              <div className={styles.ingredient_background}>
                <img
                  className={styles.ingredient_img}
                  src="https://code.s3.yandex.net/react/code/sauce-03.png"
                />
              </div>
            </li>
            <li className={`${styles.order_card_ingredient} ${styles.ingredient_more}`}>
              <div className={styles.ingredient_background}>
                <div className={`${styles.ingredient_count} text_type_main-default`}>
                  +3
                </div>
                <img
                  className={styles.ingredient_img}
                  src="https://code.s3.yandex.net/react/code/cheese.png"
                />
              </div>
            </li>
          </ul>
          <div className={`${styles.order_card_price} text_type_digits-default`}>
            480
            <CurrencyIcon type="primary" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
