import type { TIngredient } from '@utils/types';

import styles from './ingredient-image.module.css';

type TIngredientImage = {
  ingredient: TIngredient;
  className?: string;
  value?: string;
};

const IngredientImage = ({
  ingredient,
  className,
  value,
}: TIngredientImage): React.JSX.Element => {
  return (
    <div
      className={`${styles.order_card_ingredient} ${className ?? ''} ${value ? styles.ingredient_more : ''} `}
    >
      <div className={styles.ingredient_background}>
        {/* TODO: Добавить Picture */}
        {value && (
          <div className={`${styles.ingredient_count} text_type_main-default`}>
            {value}
          </div>
        )}
        <img
          className={styles.ingredient_img}
          src={ingredient.image}
          alt={ingredient.name}
        />
      </div>
    </div>
  );
};

export default IngredientImage;
