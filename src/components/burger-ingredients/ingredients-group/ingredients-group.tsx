import { forwardRef } from 'react';

import IngredientItem from '@components/burger-ingredients/ingredient-item/ingredient-item';

import type { TIngredient } from '@utils/types';

import styles from './ingredients-group.module.css';

type TIngredientsGroupProps = {
  id?: string;
  title: string;
  group: TIngredient[];
  onItemClick?: (ingredient: TIngredient) => void;
};

const IngredientsGroup = forwardRef<HTMLElement, TIngredientsGroupProps>(
  function IngredientsGroup({ id, title, group, onItemClick }, ref): React.JSX.Element {
    return (
      <section id={id} ref={ref}>
        <h3>{title}</h3>
        <ul className={styles.ingredients_group}>
          {group.map((ingredient) => (
            <IngredientItem
              key={ingredient._id}
              ingredient={ingredient}
              onClick={() => onItemClick?.(ingredient)}
            />
          ))}
        </ul>
      </section>
    );
  }
);
IngredientsGroup.displayName = 'IngredientsGroup';
export default IngredientsGroup;
