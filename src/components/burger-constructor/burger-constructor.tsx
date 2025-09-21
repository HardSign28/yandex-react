import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState } from 'react';
import { useDrop, type DropTargetMonitor } from 'react-dnd';

import OrderDetails from '@components/burger-constructor/order-details/order-details';
import Modal from '@components/modal/modal';

import type {
  Collected,
  DragItem,
  TBurgerConstructorProps,
  TIngredient,
} from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [bun, setBun] = useState<TIngredient | null>(null);

  const dropSpec = useCallback(
    () => ({
      accept: 'bun' as const,
      drop: (item: DragItem): void => setBun(item.ingredient),
      collect: (monitor: DropTargetMonitor<DragItem, void>): Collected => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  const [{ canDrop: canDropTop }, dropTopRef] = useDrop<DragItem, void, Collected>(
    dropSpec,
    [dropSpec]
  );

  const [{ canDrop: canDropBottom }, dropBottomRef] = useDrop<DragItem, void, Collected>(
    dropSpec,
    [dropSpec]
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
          style={{
            outline: canDropTop || canDropBottom ? '2px dashed #4C6FFF' : 'none',
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
