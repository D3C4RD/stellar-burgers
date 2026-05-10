import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useSelector, useDispatch } from '../../services/store';
import {
  selectNewOrder,
  selectOrderRequest,
  setNewOrder
} from '../../services/slices/orders/orders-slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { postUserBurgerThunk } from '../../services/slices/orders/actions';
import {
  clearBurger,
  selectBurgerConstructor
} from '../../services/slices/constructor/constructor-slice';
import { selectUser } from '../../services/slices/user/user-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const constructorItems = useSelector(selectBurgerConstructor);

  const orderRequest = useSelector(selectOrderRequest);

  const orderModalData = useSelector(selectNewOrder).order;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!user) {
      return navigate('/login', {
        replace: true,
        state: {
          from: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }
      });
    } else {
      const from = location.state?.from || { pathname: '/' };
      const backgroundLocation = location.state?.from?.background || null;

      const itemsId = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((ingredient) => ingredient._id),
        constructorItems.bun._id
      ];

      dispatch(postUserBurgerThunk(itemsId)).then(() =>
        dispatch(clearBurger())
      );
      return navigate(from, {
        replace: true,
        state: { background: backgroundLocation }
      });
    }
  };
  const closeOrderModal = () => {
    dispatch(setNewOrder(false));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
