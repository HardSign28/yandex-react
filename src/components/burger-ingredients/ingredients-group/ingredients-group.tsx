import { forwardRef } from 'react';

import IngredientItem from '@components/burger-ingredients/ingredient-item/ingredient-item';

import type { TIngredientsGroupProps } from '@utils/types';

import styles from './ingredients-group.module.css';

const IngredientsGroup = forwardRef<HTMLElement, TIngredientsGroupProps>(
  function IngredientsGroup(
    { id, title, group, onItemClick, counts }: TIngredientsGroupProps,
    ref
  ): React.JSX.Element {
    return (
      <section className="mt-10 mb-10" id={id} ref={ref}>
        <h3 className="text text_type_main-medium mb-6">{title}</h3>
        <ul className={`${styles.ingredients_group} ml-4 mr-4`}>
          {group.map((ingredient) => (
            <IngredientItem
              key={ingredient._id}
              ingredient={ingredient}
              onClick={() => onItemClick?.(ingredient)}
              count={counts[ingredient._id] ?? 0}
            />
          ))}
        </ul>
      </section>
    );
  }
);
IngredientsGroup.displayName = 'IngredientsGroup';
export default IngredientsGroup;
