import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import type { DragItem, IngredientType, TIngredientProps } from '@utils/types';

import styles from './ingredient-item.module.css';

const IngredientItem = ({
  ingredient,
  onClick,
  count = 0,
}: TIngredientProps): React.JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag<DragItem, void, { isDragging: boolean }>(
    () => ({
      type: ingredient.type as IngredientType,
      item: { ingredient },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );
  return (
    <li
      ref={(node) => {
        if (node) dragRef(node);
      }}
      className={styles.ingredient_item}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
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
      {count > 0 && (
        <Counter
          count={count}
          size="default"
          extraClass={`${styles.ingredient_item_count} m-1`}
        />
      )}
    </li>
  );
};

export default IngredientItem;
