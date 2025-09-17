import { forwardRef } from 'react';

import IngredientItem from '@components/burger-ingredients/ingredient-item/ingredient-item';

import type { TIngredient } from '@utils/types';

import styles from './ingredients-group.module.css';

type TIngredientsGroupProps = {
  id?: string;
  title: string;
  group: TIngredient[];
};

const IngredientsGroup = forwardRef<HTMLElement, TIngredientsGroupProps>(
  ({ id, title, group }, ref): React.JSX.Element => {
    return (
      <section id={id} ref={ref}>
        <h3>{title}</h3>
        <ul className={styles.ingredients_group}>
          {group.map((ingredient) => (
            <IngredientItem ingredient={ingredient} key={ingredient._id} />
          ))}
        </ul>
      </section>
    );
  }
);
IngredientsGroup.displayName = 'IngredientsGroup';
export default IngredientsGroup;
