import IngredientImage from '@components/order-card/ingredient-image/ingredient-image';

import type { TIngredient } from '@utils/types';

import styles from './ingredients-short.module.css';

type RenderIngredientsProps = {
  ingredients: TIngredient[];
  limit?: number;
};

const IngredientsShort = ({
  ingredients,
  limit = 6,
}: RenderIngredientsProps): React.JSX.Element[] => {
  const total = ingredients.length;
  const sliced = total > limit ? ingredients.slice(0, limit) : ingredients;
  const extraCount = total - sliced.length;

  return sliced.map((ing, index) => {
    const isLast = index === sliced.length - 1;

    return (
      <IngredientImage
        key={index}
        className={styles.order_card_ingredient}
        ingredient={ing}
        value={isLast && extraCount > 0 ? `+${extraCount}` : ''}
      />
    );
  });
};

export default IngredientsShort;
