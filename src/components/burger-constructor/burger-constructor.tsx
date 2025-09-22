import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo } from 'react';
import { useDrop, type DropTargetMonitor } from 'react-dnd';

import OrderDetails from '@components/burger-constructor/order-details/order-details';
import Modal from '@components/modal/modal';

import type { Collected, DragItem, TIngredient, TOrderDetails } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({
  bun,
  ingredients,
  setBun,
  addIngredient,
  removeIngredient,
  onCheckout,
  orderDetails,
  setOrderDetails,
}: {
  bun: TIngredient | null;
  ingredients: TIngredient[];
  setBun: (bun: TIngredient | null) => void;
  addIngredient: (ingredient: TIngredient) => void;
  removeIngredient: (index: number) => void;
  orderDetails: TOrderDetails | null;
  setOrderDetails: (orderDetails: TOrderDetails | null) => void;
  onCheckout: () => Promise<void>;
}): React.JSX.Element => {
  const total = useMemo(() => {
    const ingredientsSum = ingredients.reduce((sum, item) => sum + (item.price || 0), 0);
    return (bun ? (bun.price || 0) * 2 : 0) + ingredientsSum;
  }, [bun, ingredients]);

  const dropSpec = useCallback(
    () => ({
      accept: 'bun' as const,
      drop: (item: DragItem): void => setBun(item.ingredient),
      collect: (monitor: DropTargetMonitor<DragItem, void>): Collected => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    [setBun]
  );

  const [{ canDrop: canDropTop }, dropTopRef] = useDrop<DragItem, void, Collected>(
    dropSpec,
    [dropSpec]
  );

  const [{ canDrop: canDropBottom }, dropBottomRef] = useDrop<DragItem, void, Collected>(
    dropSpec,
    [dropSpec]
  );

  const midDropSpec = useCallback(
    () => ({
      accept: ['main', 'sauce'] as ('main' | 'sauce')[],
      drop: (item: DragItem): void => addIngredient(item.ingredient),
      collect: (monitor: DropTargetMonitor<DragItem, void>): Collected => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  const [{ canDrop: canDropMid }, dropMidRef] = useDrop<DragItem, void, Collected>(
    midDropSpec,
    [midDropSpec]
  );

  const closeModal = useCallback(() => setOrderDetails(null), []);

  return (
    <section className={`${styles.burger_constructor} mb-10`}>
      <div className={`${styles.burger_constructor_wrapper}`}>
        <div
          ref={(node) => {
            if (node) dropTopRef(node);
          }}
          className={`${styles.burger_ingredient_empty} ${
            canDropTop || canDropBottom ? styles.can_drop : ''
          } constructor-element constructor-element_pos_top ml-10`}
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

        <div
          ref={(node) => {
            if (node) dropMidRef(node);
          }}
          className={`${styles.burger_ingredients} custom-scroll`}
        >
          {ingredients.length === 0 ? (
            <div
              className={`${styles.burger_ingredient_empty} ${
                canDropMid ? styles.can_drop : ''
              } constructor-element ml-10`}
            >
              Перетащите начинку сюда
            </div>
          ) : (
            ingredients.map((ing, index) => (
              <div
                className={styles.burger_ingredients_item}
                key={`${ing._id}-${index}`}
              >
                <DragIcon type="primary" className="mr-2" />
                <ConstructorElement
                  text={ing.name}
                  price={ing.price}
                  thumbnail={ing.image}
                  handleClose={() => removeIngredient(index)}
                />
              </div>
            ))
          )}
        </div>
        <div
          ref={(node) => {
            if (node) dropBottomRef(node);
          }}
          className={`${styles.burger_ingredient_empty} ${
            canDropTop || canDropBottom ? styles.can_drop : ''
          } constructor-element constructor-element_pos_bottom ml-10`}
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
          <div className="text text_type_digits-medium mr-2">{total}</div>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          onClick={() => void onCheckout()}
          htmlType="button"
          type="primary"
          size="large"
        >
          Оформить заказ
        </Button>
      </div>
      <Modal
        isOpen={!!orderDetails}
        onClose={closeModal}
        labelledById="ingredient-modal-title"
        closeOnOverlay
      >
        <OrderDetails orderDetails={orderDetails} />
      </Modal>
    </section>
  );
};
