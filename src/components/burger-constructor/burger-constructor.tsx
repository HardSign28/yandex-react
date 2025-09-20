import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import OrderDetails from '@components/burger-constructor/order-details/order-details';
import Modal from '@components/modal/modal.tsx';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  console.log(ingredients);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = (): void => {
    setModalIsOpen(false);
  };

  return (
    <section className={`${styles.burger_constructor} mb-10`}>
      <div className={`${styles.burger_constructor_wrapper}`}>
        <ConstructorElement
          type="top"
          isLocked={true}
          text="Краторная булка N-200i (верх)"
          price={200}
          thumbnail={ingredients[0].image}
          extraClass="ml-10"
        />
        <div className={`${styles.burger_ingredients} custom-scroll`}>
          <DndProvider backend={HTML5Backend}>
            <div className={styles.burger_ingredients_item}>
              <DragIcon type="primary" className="mr-2" />
              <ConstructorElement
                text="Краторная булка N-200i (верх)"
                price={50}
                thumbnail={ingredients[1].image}
              />
            </div>
            <div className={styles.burger_ingredients_item}>
              <DragIcon type="primary" className="mr-2" />
              <ConstructorElement
                text="Краторная булка N-200i (верх)"
                price={50}
                thumbnail={ingredients[1].image}
              />
            </div>
            <div className={styles.burger_ingredients_item}>
              <DragIcon type="primary" className="mr-2" />
              <ConstructorElement
                text="Краторная булка N-200i (верх)"
                price={50}
                thumbnail={ingredients[1].image}
              />
            </div>
            <div className={styles.burger_ingredients_item}>
              <DragIcon type="primary" className="mr-2" />
              <ConstructorElement
                text="Краторная булка N-200i (верх)"
                price={50}
                thumbnail={ingredients[1].image}
              />
            </div>
            <div className={styles.burger_ingredients_item}>
              <DragIcon type="primary" className="mr-2" />
              <ConstructorElement
                text="Краторная булка N-200i (верх)"
                price={50}
                thumbnail={ingredients[1].image}
              />
            </div>
            <div className={styles.burger_ingredients_item}>
              <DragIcon type="primary" className="mr-2" />
              <ConstructorElement
                text="Краторная булка N-200i (верх)"
                price={50}
                thumbnail={ingredients[1].image}
              />
            </div>
            <div className={styles.burger_ingredients_item}>
              <DragIcon type="primary" className="mr-2" />
              <ConstructorElement
                text="Краторная булка N-200i (верх)"
                price={50}
                thumbnail={ingredients[1].image}
              />
            </div>
            <div className={styles.burger_ingredients_item}>
              <DragIcon type="primary" className="mr-2" />
              <ConstructorElement
                text="Краторная булка N-200i (верх)"
                price={50}
                thumbnail={ingredients[1].image}
              />
            </div>
          </DndProvider>
        </div>
        <ConstructorElement
          type="bottom"
          isLocked={true}
          text="Краторная булка N-200i (низ)"
          price={200}
          thumbnail={ingredients[0].image}
          extraClass="ml-10"
        />
      </div>
      <div className={`${styles.checkout} mt-10 mb-10`}>
        <div className={`${styles.checkout_price} mr-10`}>
          <div className="text text_type_digits-medium mr-2">610</div>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          onClick={() => setModalIsOpen(true)}
          htmlType="button"
          type="primary"
          size="large"
        >
          Оформить заказ
        </Button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onClose={closeModal}
        labelledById="ingredient-modal-title"
        closeOnOverlay
      >
        <OrderDetails />
      </Modal>
    </section>
  );
};
