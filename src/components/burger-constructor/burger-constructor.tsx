import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo } from 'react';
import { useDrop, type DropTargetMonitor } from 'react-dnd';

import BurgerConstructorItem from '@components/burger-constructor/burger-constructor-item/burger-constructor-item';
import OrderDetails from '@components/burger-constructor/order-details/order-details';
import Modal from '@components/modal/modal';

import type { TCollected, TDragItem, TIngredient, TOrderDetails } from '@utils/types';
import type { Dispatch, SetStateAction } from 'react';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({
  bun,
  ingredients,
  setIngredients,
  setBun,
  addIngredient,
  removeIngredient,
  onCheckout,
  orderDetails,
  setOrderDetails,
}: {
  bun: TIngredient | null;
  ingredients: TIngredient[];
  setIngredients: Dispatch<SetStateAction<TIngredient[]>>;
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
      drop: (item: TDragItem): void => setBun(item.ingredient),
      collect: (monitor: DropTargetMonitor<TDragItem, void>): TCollected => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    [setBun]
  );

  const [{ canDrop: canDropTop }, dropTopRef] = useDrop<TDragItem, void, TCollected>(
    dropSpec,
    [dropSpec]
  );

  const [{ canDrop: canDropBottom }, dropBottomRef] = useDrop<
    TDragItem,
    void,
    TCollected
  >(dropSpec, [dropSpec]);

  const midDropSpec = useCallback(
    () => ({
      accept: ['main', 'sauce'] as ('main' | 'sauce')[],
      drop: (item: TDragItem): void => addIngredient(item.ingredient),
      collect: (monitor: DropTargetMonitor<TDragItem, void>): TCollected => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  const [{ canDrop: canDropMid }, dropMidRef] = useDrop<TDragItem, void, TCollected>(
    midDropSpec,
    [midDropSpec]
  );

  const closeModal = useCallback(() => setOrderDetails(null), []);

  const moveIngredient = (from: number, to: number): void => {
    setIngredients((prev) => {
      const newItems = [...prev];
      const [removed] = newItems.splice(from, 1);
      newItems.splice(to, 0, removed);
      return newItems;
    });
  };

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
            ingredients.map((ingredient, index) => (
              <BurgerConstructorItem
                key={`${ingredient._id}-${index}`}
                ingredient={ingredient}
                index={index}
                moveIngredient={moveIngredient}
                removeIngredient={removeIngredient}
              />
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
