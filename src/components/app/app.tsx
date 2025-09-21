import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { IngredientsResponse, State, TIngredient } from '@utils/types';

import styles from './app.module.css';

const API_URL = 'https://norma.nomoreparties.space';

export const App = (): React.JSX.Element => {
  const [state, setState] = useState<State>({
    productData: [],
    loading: true,
    error: null,
  });

  const getProductData = async (): Promise<void> => {
    setState((state) => ({ ...state, loading: true, error: null }));
    try {
      const res = await fetch(`${API_URL}/api/ingredients`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as IngredientsResponse;
      if (Array.isArray(data?.data)) {
        const items: TIngredient[] = data.data;
        setState((s) => ({ ...s, productData: items, loading: false }));
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : typeof e === 'string' ? e : 'Fetch error';
      setState((s) => ({ ...s, error: message }));
      console.error(message);
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  useEffect(() => {
    void getProductData();
  }, []);
  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-4`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-4 pr-4`}>
        {state.loading && 'Загрузка...'}
        {!state.loading && state.productData.length > 0 && (
          <DndProvider backend={HTML5Backend}>
            <BurgerIngredients ingredients={state.productData} />
            <BurgerConstructor />
          </DndProvider>
        )}
      </main>
    </div>
  );
};

export default App;
