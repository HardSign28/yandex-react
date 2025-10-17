import { useGetIngredientsQuery } from '@/store/api';
import { useAppSelector } from '@/store/hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import Loader from '@components/loader/loader';

import styles from './home.module.css';

const Home = (): React.JSX.Element => {
  const { isLoading } = useGetIngredientsQuery();
  const ingredients = useAppSelector((state) => state.ingredients.items);
  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-4`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-4 pr-4`}>
        {isLoading && <Loader />}
        {!isLoading && ingredients.length > 0 && (
          <DndProvider backend={HTML5Backend}>
            <BurgerIngredients />
            <BurgerConstructor />
          </DndProvider>
        )}
      </main>
    </>
  );
};

export default Home;
