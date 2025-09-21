import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredientProps } from '@utils/types';

import styles from './ingredient-item.module.css';

const IngredientItem = ({
  ingredient,
  onClick,
}: TIngredientProps): React.JSX.Element => {
  return (
    <li className={styles.ingredient_item} onClick={onClick}>
      <picture>
        {ingredient.image_mobile && (
          <source media="(max-width: 600px)" srcSet={ingredient.image_mobile} />
        )}
        <img
          className={styles.ingredient_item_image}
          src={ingredient.image}
          alt={ingredient.name}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div
        className={`${styles.ingredient_item_price} text text_type_digits-default mt-1 mb-1`}
      >
        {ingredient.price}
        <CurrencyIcon type="primary" />
      </div>
      <div className={`${styles.ingredient_item_name} text text_type_main-default`}>
        {ingredient.name}
      </div>
      <Counter
        count={1}
        size="default"
        extraClass={`${styles.ingredient_item_count} m-1`}
      />
    </li>
  );
};

export default IngredientItem;
