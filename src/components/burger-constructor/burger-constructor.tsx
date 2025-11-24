import IconSpinner from '@/images/spinner.svg?react';
import { useCreateOrderMutation } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';
import {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
} from '@/store/slices/burgerConstructorSlice';
import { clearOrder } from '@/store/slices/orderSlice';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo } from 'react';
import { useDrop, type DropTargetMonitor } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import BurgerConstructorItem from '@components/burger-constructor/burger-constructor-item/burger-constructor-item';
import OrderDetails from '@components/burger-constructor/order-details/order-details';
import Modal from '@components/modal/modal';
import { formatThousands } from '@utils/format.ts';

import type { TCollected, TDragItem } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const bun = useAppSelector((state) => state.burgerConstructor.bun);
  const ingredients = useAppSelector((state) => state.burgerConstructor.ingredients);
  const orderDetails = useAppSelector((state) => state.order.last);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  /**
   * Расчет итоговой суммы
   */
  const total = useMemo(() => {
    const ingredientsSum = ingredients.reduce((sum, item) => sum + (item.price || 0), 0);
    return (bun ? (bun.price || 0) * 2 : 0) + ingredientsSum;
  }, [bun, ingredients]);

  /**
   * Перетаскивание булки
   */
  const dropSpec = useCallback(
    () => ({
      accept: 'bun' as const,
      drop: (item: TDragItem): void => {
        dispatch(setBun(item.ingredient));
      },
      collect: (monitor: DropTargetMonitor<TDragItem, void>): TCollected => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    [dispatch]
  );

  /**
   * Дроп зона верхней булки
   */
  const [{ canDrop: canDropTop }, dropTopRef] = useDrop<TDragItem, void, TCollected>(
    dropSpec,
    [dropSpec]
  );

  /**
   * Дроп зона нижней булки
   */
  const [{ canDrop: canDropBottom }, dropBottomRef] = useDrop<
    TDragItem,
    void,
    TCollected
  >(dropSpec, [dropSpec]);

  /**
   * Перетаскивание ингредиентов
   */
  const midDropSpec = useCallback(
    () => ({
      accept: ['main', 'sauce'] as ('main' | 'sauce')[],
      drop: (item: TDragItem): void => {
        dispatch(addIngredient(item.ingredient));
      },
      collect: (monitor: DropTargetMonitor<TDragItem, void>): TCollected => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  /**
   * Дроп зона ингредиентов
   */
  const [{ canDrop: canDropMid }, dropMidRef] = useDrop<TDragItem, void, TCollected>(
    midDropSpec,
    [midDropSpec]
  );

  /**
   * Сортировка ингредиентов
   * @param from - начальный индекс
   * @param to - конечный индекс
   */
  const onMove = (from: number, to: number): void => {
    dispatch(moveIngredient({ from, to }));
  };

  /**
   * Удаление ингредиента
   * @param uid - уникальный uid ингредиента
   */
  const onRemove = (uid: string): void => {
    dispatch(removeIngredient(uid));
  };

  /**
   * Оформление заказа
   */
  const checkout = async (): Promise<void> => {
    if (!bun || ingredients.length === 0) return;
    if (!user) {
      await navigate('/login');
      return;
    }
    const ingredientsId = [bun._id, ...ingredients.map((i) => i._id), bun._id];

    try {
      await createOrder({ ingredients: ingredientsId }).unwrap();
      dispatch(resetConstructor());
    } catch (e) {
      console.error('Ошибка оформления заказа:', e);
    }
  };

  /**
   * Закрытие модального окна заказа
   */
  const closeModal = (): void => {
    dispatch(clearOrder());
  };

  return (
    <section className={styles.burger_constructor}>
      <div className={`${styles.burger_constructor_wrapper}`}>
        <div
          ref={(node) => {
            if (node) dropTopRef(node);
          }}
          className={`${styles.burger_ingredient_empty} ${
            canDropTop || canDropBottom ? styles.can_drop : ''
          } constructor-element constructor-element_pos_top ml-10`}
          data-testid="drop-bun-top"
        >
          {bun ? (
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${bun.name} (верх)`}
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
          data-testid="drop-ingredients"
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
                key={ingredient.uid}
                ingredient={ingredient}
                index={index}
                moveIngredient={onMove}
                removeIngredient={() => onRemove(ingredient.uid)}
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
              text={`${bun.name} (низ)`}
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
          <div className="text text_type_digits-medium mr-2">
            {formatThousands(total)}
          </div>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          onClick={() => void checkout()}
          htmlType="button"
          type="primary"
          size="large"
          extraClass={`${styles.button} button_with_spinner`}
          disabled={isLoading}
          data-testid="order-button"
        >
          {isLoading ? <IconSpinner className="button_spinner" /> : 'Оформить заказ'}
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
