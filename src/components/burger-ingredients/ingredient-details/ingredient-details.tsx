import type { TIngredientProps } from '@utils/types';

import styles from './ingredient-details.module.css';

const IngredientDetails = ({ ingredient }: TIngredientProps): React.JSX.Element => {
  return (
    <div className={`${styles.ingredient_details} mb-4`}>
      <picture>
        {ingredient?.image_mobile && (
          <source media="(max-width: 600px)" srcSet={ingredient.image_mobile} />
        )}
        {ingredient?.image_large && (
          <source media="(min-width: 601px)" srcSet={ingredient.image_large} />
        )}
        <img
          className={`${styles.ingredient_details_image} mb-4`}
          src={ingredient?.image}
          alt={ingredient?.name}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div
        className="text text_type_main-medium mb-8"
        data-testid="ingredient-modal-name"
      >
        {ingredient?.name}
      </div>
      <div
        className={`${styles.nutritional_facts} text text_type_main-default text_color_inactive`}
      >
        <div className={styles.nutritional_facts_item}>
          <div data-testid="ingredient-calories">Калории, ккал</div>
          <div className="text text_type_digits-default">{ingredient?.calories}</div>
        </div>
        <div className={styles.nutritional_facts_item}>
          <div data-testid="ingredient-proteins">Белки, г</div>
          <div className="text text_type_digits-default">{ingredient?.proteins}</div>
        </div>
        <div className={styles.nutritional_facts_item}>
          <div data-testid="ingredient-fat">Жиры, г</div>
          <div className="text text_type_digits-default">{ingredient?.fat}</div>
        </div>
        <div className={styles.nutritional_facts_item}>
          <div data-testid="ingredient-carbohydrates">Углеводы, г</div>
          <div className="text text_type_digits-default">
            {ingredient?.carbohydrates}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;
