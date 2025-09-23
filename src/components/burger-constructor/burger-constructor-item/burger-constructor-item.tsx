import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { BurgerConstructorItemProps } from '@utils/types';

import styles from './burger-constructor-item.module.css';
const BurgerConstructorItem = ({
  ingredient,
  index,
  moveIngredient,
  removeIngredient,
}: BurgerConstructorItemProps): React.JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<{ index: number }, void>({
    accept: 'ingredients',
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveIngredient(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'ingredients',
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));
  return (
    <div
      ref={ref}
      className={`${styles.burger_constructor_item} ${isDragging ? styles.is_dragging : ''}  constructor-element__row`}
    >
      <DragIcon type="primary" className="mr-2" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => removeIngredient(index)}
      />
    </div>
  );
};

export default BurgerConstructorItem;
