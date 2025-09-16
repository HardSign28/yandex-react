import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState } from 'react';

import IngredientsGroup from '@components/burger-ingredients/ingredients-group/ingredients-group';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};
const TABS = ['bun', 'main', 'sauce'] as const;
type IngredientType = (typeof TABS)[number];

const TYPES: Record<IngredientType, IngredientType> = {
  bun: 'bun',
  main: 'main',
  sauce: 'sauce',
};

const LABELS: Record<IngredientType, string> = {
  bun: 'Булки',
  main: 'Начинки',
  sauce: 'Соусы',
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [current, setCurrent] = useState<IngredientType>('bun');
  const bunRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const sauceRef = useRef<HTMLElement>(null);

  const buns = useMemo(() => {
    return ingredients.filter((item) => item.type === TYPES.bun);
  }, [ingredients]);

  const mains = useMemo(() => {
    return ingredients.filter((item) => item.type === TYPES.main);
  }, [ingredients]);

  const sauces = useMemo(() => {
    return ingredients.filter((item) => item.type === TYPES.sauce);
  }, [ingredients]);

  const onTabClick = (tab: IngredientType): void => {
    setCurrent(tab);
    (tab === TYPES.bun
      ? bunRef
      : tab === TYPES.main
        ? mainRef
        : sauceRef
    ).current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            {TABS.map((tab) => (
              <Tab
                key={tab}
                value={tab}
                active={current === tab}
                onClick={() => onTabClick(tab)}
              >
                {LABELS[tab]}
              </Tab>
            ))}
          </ul>
        </nav>
        <div style={{ overflowY: 'scroll' }}>
          <IngredientsGroup
            id="section-bun"
            ref={bunRef}
            title={LABELS.bun}
            group={buns}
          />
          <IngredientsGroup
            id="section-main"
            ref={mainRef}
            title={LABELS.main}
            group={mains}
          />
          <IngredientsGroup
            id="section-sauce"
            ref={sauceRef}
            title={LABELS.sauce}
            group={sauces}
          />
        </div>
      </section>
    </>
  );
};
