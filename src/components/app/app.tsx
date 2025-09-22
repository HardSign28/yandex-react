import { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type {
  IngredientsResponse,
  State,
  TIngredient,
  TOrderDetails,
} from '@utils/types';

import styles from './app.module.css';

const API_URL = 'https://norma.nomoreparties.space';

export const App = (): React.JSX.Element => {
  const [state, setState] = useState<State>({
    productData: [],
    loading: true,
    error: null,
  });

  const [bun, setBun] = useState<TIngredient | null>(null);
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [orderDetails, setOrderDetails] = useState<TOrderDetails | null>(null);

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

  const getOrderData = async (): Promise<void> => {
    if (!bun || !ingredients.length) return;
    const ingredientsIds = ingredients.map((item) => item._id);
    const requestData = {
      ingredients: [bun._id, ...ingredientsIds],
    };

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as TOrderDetails;

      if (data) {
        setOrderDetails(data);
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : typeof e === 'string' ? e : 'Fetch error';
      setState((s) => ({ ...s, error: message }));
      console.error(message);
    }
  };

  useEffect(() => {
    void getProductData();
  }, []);

  const counts = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    // начинки — по количеству вхождений
    for (const ingredient of ingredients)
      map[ingredient._id] = (map[ingredient._id] ?? 0) + 1;
    // булка — если выбрана, всегда 2
    if (bun) map[bun._id] = (map[bun._id] ?? 0) + 2;
    return map;
  }, [bun, ingredients]);

  const removeIngredient = (index: number): void => {
    setIngredients((ingredients) => ingredients.filter((_, idx) => idx !== index));
  };

  const addIngredient = (ingredient: TIngredient): void => {
    setIngredients((ingredients) => [...ingredients, ingredient]);
  };

  const checkout = async (): Promise<void> => {
    await getOrderData();
  };

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
            <BurgerIngredients ingredients={state.productData} counts={counts} />
            <BurgerConstructor
              bun={bun}
              ingredients={ingredients}
              setBun={setBun}
              addIngredient={(ingredient) => addIngredient(ingredient)}
              removeIngredient={(index) => removeIngredient(index)}
              orderDetails={orderDetails}
              setOrderDetails={setOrderDetails}
              onCheckout={checkout}
            />
          </DndProvider>
        )}
      </main>
    </div>
  );
};

export default App;
