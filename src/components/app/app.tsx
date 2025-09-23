import IconSpinner from '@/images/spinner.svg?react';
import { useGetIngredientsQuery } from '@/store/api';
import { useAppSelector } from '@/store/hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { isLoading } = useGetIngredientsQuery();
  const ingredients = useAppSelector((s) => s.ingredients.items);
  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-4`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-4 pr-4`}>
        {isLoading && (
          <div className={`${styles.loading} text text_type_main-medium`}>
            <IconSpinner className={styles.spinner_icon} />
            Загрузка
          </div>
        )}
        {!isLoading && ingredients.length > 0 && (
          <DndProvider backend={HTML5Backend}>
            <BurgerIngredients />
            <BurgerConstructor />
          </DndProvider>
        )}
      </main>
    </div>
  );
};

export default App;
