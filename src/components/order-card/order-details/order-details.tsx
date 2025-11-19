import { useParams } from 'react-router-dom';
/* TODO: Переименовать тут или у бургера */
const OrderDetails = (): React.JSX.Element => {
  const { feedId } = useParams();
  return (
    <div>
      <div>
        Детали заказа #<span>{feedId}</span>
      </div>
    </div>
  );
};

export default OrderDetails;
