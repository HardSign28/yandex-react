import { useParams } from 'react-router-dom';
/* TODO: Переименовать тут или у бургера */
const OrderDetails = (): React.JSX.Element => {
  const { id } = useParams();
  return (
    <div>
      <div>
        Детали заказа #<span>{id}</span>
      </div>
    </div>
  );
};

export default OrderDetails;
