import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';

import OrderDetails from '@components/burger-constructor/order-details/order-details';
import Modal from '@components/modal/modal';

import type { TBurgerConstructorProps, TIngredient } from '@utils/types';
type DragItemBun = { ingredient: TIngredient };

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [bun, setBun] = useState<TIngredient | null>(null);

  /**
   * Drop зона верхней булки
   */
  const [{ isOverTop }, dropTopRef] = useDrop<DragItemBun, void, { isOverTop: boolean }>(
    () => ({
      accept: 'bun',
      drop: (item): void => setBun(item.ingredient),
      collect: (monitor): { isOverTop: boolean } => ({ isOverTop: monitor.isOver() }),
    }),
    []
  );

  /**
   * Drop зона нижней булки
   */
  const [{ isOverBottom }, dropBottomRef] = useDrop<
    DragItemBun,
    void,
    { isOverBottom: boolean }
  >(
    () => ({
      accept: 'bun',
      drop: (item): void => setBun(item.ingredient),
      collect: (monitor): { isOverBottom: boolean } => ({
        isOverBottom: monitor.isOver(),
      }),
    }),
    []
  );

  const demoItems = useMemo(() => {
    return ingredients.filter((item) => item.type === 'main');
  }, [ingredients]);

  const closeModal = (): void => {
    setModalIsOpen(false);
  };

  return (
    <section className={`${styles.burger_constructor} mb-10`}>
      <div className={`${styles.burger_constructor_wrapper}`}>
        <div
          ref={(node) => {
            if (node) dropTopRef(node);
          }}
          style={{ outline: isOverTop ? '2px dashed #4C6FFF' : 'none' }}
        >
          <ConstructorElement
            type="top"
            isLocked={true}
            text={bun ? bun.name : 'Перетащите булку сюда'}
            price={bun ? bun.price : 0}
            thumbnail={bun ? bun.image : ''}
            extraClass="ml-10"
          />
        </div>
        <div className={`${styles.burger_ingredients} custom-scroll`}>
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
        </div>
        <div
          ref={(node) => {
            if (node) dropBottomRef(node);
          }}
          style={{ outline: isOverBottom ? '2px dashed #4C6FFF' : 'none' }}
        >
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={bun ? bun.name : 'Перетащите булку сюда'}
            price={bun ? bun.price : 0}
            thumbnail={bun ? bun.image : ''}
            extraClass="ml-10"
          />
        </div>
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
