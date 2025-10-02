import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { select } from '@/store/slices/selectedIngredientSlice';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState, useCallback } from 'react';

import IngredientsGroup from '@components/burger-ingredients/ingredients-group/ingredients-group';
import { LABELS, TABS, TYPES } from '@utils/types';

import type { TIngredientType, TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState<TIngredientType>('bun');
  const bunRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const sauceRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bun = useAppSelector((s) => s.burgerConstructor.bun);
  const ingredients = useAppSelector((s) => s.ingredients.items);
  const selectedIngredients = useAppSelector((s) => s.burgerConstructor.ingredients);
  const isTickingRef = useRef(false);

  /**
   * Открытие модалки ингредиента
   */
  const openIngredient = useCallback(
    (ingredient: TIngredient) => {
      dispatch(select(ingredient));
    },
    [dispatch]
  );

  /**
   * Счетчик ингредиентов
   */
  const counts = useMemo<Record<string, number>>(() => {
    const counts = selectedIngredients.reduce<Record<string, number>>((acc, item) => {
      acc[item._id] = (acc[item._id] ?? 0) + 1;
      return acc;
    }, {});

    if (bun) {
      counts[bun._id] = (counts[bun._id] ?? 0) + 2;
    }

    return counts;
  }, [bun, selectedIngredients]);

  /**
   * Раздел "Булки"
   */
  const buns = useMemo(() => {
    return ingredients.filter((item) => item.type === TYPES.bun);
  }, [ingredients]);

  /**
   * Раздел "Начинки"
   */
  const mains = useMemo(() => {
    return ingredients.filter((item) => item.type === TYPES.main);
  }, [ingredients]);

  /**
   * Раздел "Соусы"
   */
  const sauces = useMemo(() => {
    return ingredients.filter((item) => item.type === TYPES.sauce);
  }, [ingredients]);

  /**
   * Клик по вкладкам
   * @param tab - тип вкладки
   */
  const onTabClick = (tab: TIngredientType): void => {
    setCurrentTab(tab);
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

  /**
   * Переключение вкладок при скролле
   */
  const handleScroll = useCallback(() => {
    if (isTickingRef.current) return;
    isTickingRef.current = true;

    requestAnimationFrame(() => {
      isTickingRef.current = false;

      const root = scrollRef.current;
      if (!root) return;

      const rootTop = root.getBoundingClientRect().top;

      const sections: [TIngredientType, HTMLElement | null][] = [
        ['bun', bunRef.current],
        ['main', mainRef.current],
        ['sauce', sauceRef.current],
      ];

      let best: { tab: TIngredientType; dist: number } | null = null;

      for (const [tab, el] of sections) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = rect.top - rootTop;

        const score = Math.abs(dist);

        if (!best || score < best.dist) {
          best = { tab, dist: score };
        }
      }

      if (best && best.tab !== currentTab) {
        setCurrentTab(best.tab);
      }
    });
  }, [currentTab]);

  return (
    <section className={`${styles.burger_ingredients} mb-10`}>
      <nav>
        <ul className={styles.menu}>
          {TABS.map((tab) => (
            <Tab
              key={tab}
              value={tab}
              active={currentTab === tab}
              onClick={() => onTabClick(tab)}
            >
              {LABELS[tab]}
            </Tab>
          ))}
        </ul>
      </nav>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`${styles.burger_ingredients_wrapper} custom-scroll`}
      >
        <IngredientsGroup
          id="section-bun"
          ref={bunRef}
          title={LABELS.bun}
          group={buns}
          onItemClick={openIngredient}
          counts={counts}
        />
        <IngredientsGroup
          id="section-main"
          ref={mainRef}
          title={LABELS.main}
          group={mains}
          onItemClick={openIngredient}
          counts={counts}
        />
        <IngredientsGroup
          id="section-sauce"
          ref={sauceRef}
          title={LABELS.sauce}
          group={sauces}
          onItemClick={openIngredient}
          counts={counts}
        />
      </div>
    </section>
  );
};
