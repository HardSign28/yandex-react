import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState, useCallback } from 'react';

import IngredientDetails from '@components/burger-ingredients/ingredient-details/ingredient-details';
import IngredientsGroup from '@components/burger-ingredients/ingredients-group/ingredients-group';
import Modal from '@components/modal/modal';
import { LABELS, TABS, TYPES } from '@utils/types';

import type { IngredientType, TBurgerIngredientsProps, TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({
  ingredients,
  counts,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<IngredientType>('bun');
  const bunRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const sauceRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const openIngredient = useCallback(
    (ingredient: TIngredient) => setSelectedIngredient(ingredient),
    []
  );
  const closeModal = useCallback(() => setSelectedIngredient(null), []);

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

  const isTickingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (isTickingRef.current) return;
    isTickingRef.current = true;

    requestAnimationFrame(() => {
      isTickingRef.current = false;

      const root = scrollRef.current;
      if (!root) return;

      const rootTop = root.getBoundingClientRect().top;

      const sections: [IngredientType, HTMLElement | null][] = [
        ['bun', bunRef.current],
        ['main', mainRef.current],
        ['sauce', sauceRef.current],
      ];

      let best: { tab: IngredientType; dist: number } | null = null;

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
      <Modal
        isOpen={!!selectedIngredient}
        onClose={closeModal}
        labelledById="ingredient-modal-title"
        closeOnOverlay
        title="Детали ингридиента"
      >
        {selectedIngredient && <IngredientDetails ingredient={selectedIngredient} />}
      </Modal>
    </section>
  );
};
