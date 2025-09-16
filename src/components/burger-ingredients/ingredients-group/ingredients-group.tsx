import IngredientItem from '@components/burger-ingredients/ingredient-item/ingredient-item';

import type { TIngredient } from '@utils/types.ts';
import type { RefObject } from 'react';

import styles from './ingredients-group.module.css';

type TIngredientsGroupProps = {
  id?: string;
  title: string;
  group: TIngredient[];
  ref: RefObject<HTMLElement | null>;
};
const IngredientsGroup = ({
  id,
  title,
  group,
  ref,
}: TIngredientsGroupProps): React.JSX.Element => {
  return (
    <section id={id} ref={ref}>
      <h3>{title}</h3>
      <ul className={styles.ingredients_group}>
        {group.map((ingredient: TIngredient) => (
          <IngredientItem ingredient={ingredient} key={ingredient._id} />
        ))}
      </ul>
    </section>
  );
};

export default IngredientsGroup;
