import type { TIngredient } from '@utils/types.ts';

import styles from './ingredient-item.module.css';

type TIngredientProps = {
  ingredient: TIngredient;
};

const IngredientItem = ({ ingredient }: TIngredientProps): React.JSX.Element => {
  return (
    <li className={styles.ingredient_item}>
      <img
        className={styles.ingredient_item_image}
        src={ingredient.image}
        alt={ingredient.name}
      />
      <div className={styles.ingredient_item_price}>{ingredient.price}</div>
      <div className={styles.ingredient_item_name}>{ingredient.name}</div>
    </li>
  );
};

export default IngredientItem;
