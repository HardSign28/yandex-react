import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  console.log(ingredients);
  const [current, setCurrent] = useState('bun');

  const Ingredient = (props: TBurgerIngredientsProps): React.JSX.Element => {
    const { ingredients } = props;
    return (
      <ul className={styles.ingredients_group}>
        {ingredients.map((ingredient: TIngredient) => (
          <li className={styles.ingredient_item} key={ingredient._id}>
            <img className={styles.ingredient_item_image} src={ingredient.image} />
            <div className={styles.ingredient_item_price}>{ingredient.price}</div>
            <div className={styles.ingredient_item_name}>{ingredient.name}</div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab value="bun" active={current === 'bun'} onClick={setCurrent}>
              Булки
            </Tab>
            <Tab value="main" active={current === 'main'} onClick={setCurrent}>
              Начинки
            </Tab>
            <Tab value="sauce" active={current === 'sauce'} onClick={setCurrent}>
              Соусы
            </Tab>
          </ul>
        </nav>
        <Ingredient ingredients={ingredients} />
      </section>
      <section></section>
    </>
  );
};
