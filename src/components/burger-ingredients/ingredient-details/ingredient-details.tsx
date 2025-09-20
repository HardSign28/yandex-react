import type { TIngredientProps } from '@utils/types';

import styles from './ingredient-details.module.css';

const IngredientDetails = ({ ingredient }: TIngredientProps): React.JSX.Element => {
  return (
    <div className={`${styles.ingredient_details} mb-4`}>
      <picture>
        {ingredient.image_mobile && (
          <source media="(max-width: 600px)" srcSet={ingredient.image_mobile} />
        )}
        {ingredient.image_large && (
          <source media="(min-width: 601px)" srcSet={ingredient.image_large} />
        )}
        <img
          className={`${styles.ingredient_details_image} mb-4`}
          src={ingredient.image}
          alt={ingredient.name}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className="text text_type_main-medium mb-8">{ingredient.name}</div>
      <div className={`${styles.nutritional_facts}`}>
        <div className={styles.nutritional_facts_item}>
          <div>Калории, ккал</div>
          <div className="text text_type_digits-default">420</div>
        </div>
        <div className={styles.nutritional_facts_item}>
          <div>Белки, г</div>
          <div className="text text_type_digits-default">80</div>
        </div>
        <div className={styles.nutritional_facts_item}>
          <div>Жиры, г</div>
          <div className="text text_type_digits-default">24</div>
        </div>
        <div className={styles.nutritional_facts_item}>
          <div>Углеводы, г</div>
          <div className="text text_type_digits-default">53</div>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;
