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
      <div className={styles.ingredient_item_price}>{ingredient.price}</div>
      <div className={styles.ingredient_item_name}>{ingredient.name}</div>
    </li>
  );
};

export default IngredientItem;
