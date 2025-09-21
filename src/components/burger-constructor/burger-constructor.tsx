import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import OrderDetails from '@components/burger-constructor/order-details/order-details';
import Modal from '@components/modal/modal.tsx';

import type { TBurgerConstructorProps } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const demoItems = useMemo(() => {
    return ingredients.filter((item) => item.type === 'main');
  }, [ingredients]);

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
            {demoItems.map((demoItem) => (
              <div className={styles.burger_ingredients_item} key={demoItem._id}>
                <DragIcon type="primary" className="mr-2" />
                <ConstructorElement
                  text="Краторная булка N-200i (верх)"
                  price={50}
                  thumbnail={demoItem.image}
                />
              </div>
            ))}
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
