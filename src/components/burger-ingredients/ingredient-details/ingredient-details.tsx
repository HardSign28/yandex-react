import type { TIngredientProps } from '@utils/types';

import styles from './ingredient-details.module.css';

const IngredientDetails = ({ ingredient }: TIngredientProps): React.JSX.Element => {
  return (
    <div className={`${styles.ingredient_details} mb-4`}>
      <picture>
        {ingredient.image_mobile && (
          <source media="(max-width: 600px)" srcSet={ingredient.image_mobile} />
        )}
        <img
          className={`${styles.ingredient_item_image} mb-4`}
          src={ingredient.image}
          alt={ingredient.name}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className={`${styles.ingredient_item_name} text text_type_main-medium`}>
        {ingredient.name}
      </div>
      <div className={'nutritional_facts'}>
        <div>
          <div>Калории, ккал</div>
          <div>420</div>
        </div>
        <div>
          <div>Белки, г</div>
          <div>80</div>
        </div>
        <div>
          <div>Жиры, г</div>
          <div>24</div>
        </div>
        <div>
          <div>Углеводы, г</div>
          <div>53</div>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;
