import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import {
  selectFeedOrders,
  selectOrdersLoading
} from '../../services/slices/orders/orders-slice';

import { useSelector, useDispatch } from '../../services/store';
import { getFeedsThunk } from '../../services/slices/orders/actions';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, [dispatch]);
  const orders = useSelector(selectFeedOrders);
  const orderLoading = useSelector(selectOrdersLoading);

  if (!orders.length || orderLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeedsThunk());
      }}
    />
  );
};
