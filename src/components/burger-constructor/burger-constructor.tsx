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
  const [{ canDrop }, dropTopRef] = useDrop<DragItemBun, void, { canDrop: boolean }>(
    () => ({
      accept: 'bun',
      drop: (item): void => setBun(item.ingredient),
      collect: (monitor): { canDrop: boolean } => ({ canDrop: monitor.canDrop() }),
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
          style={{ outline: canDrop ? '2px dashed #4C6FFF' : 'none' }}
          className={`constructor-element constructor-element_pos_top ml-10 ${styles.burger_ingredient_empty}`}
        >
          {bun ? (
            <ConstructorElement
              type="top"
              isLocked={true}
              text={bun.name}
              price={bun.price}
              thumbnail={bun.image}
            />
          ) : (
            'Перетащите булку сюда'
          )}
        </div>
        <div className={`${styles.burger_ingredients} custom-scroll`}>
          {demoItems.map((demoItem) => (
            <div className={styles.burger_ingredients_item} key={demoItem._id}>
              <DragIcon type="primary" className="mr-2" />
              <ConstructorElement
                text={demoItem.name}
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
          className={`constructor-element constructor-element_pos_bottom ml-10 ${styles.burger_ingredient_empty}`}
          style={{ outline: isOverBottom ? '2px dashed #4C6FFF' : 'none' }}
        >
          {bun ? (
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={bun.name}
              price={bun.price}
              thumbnail={bun.image}
            />
          ) : (
            'Перетащите булку сюда'
          )}
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
