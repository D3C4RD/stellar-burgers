import { combineSlices } from '@reduxjs/toolkit';

import { ingredientsSlice } from './slices/ingredients/ingredients-slice';
import { constructorSlice } from './slices/constructor/constructor-slice';
import { ordersSlice } from './slices/orders/orders-slice';
import { userSlice } from './slices/user/user-slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  userSlice,
  ordersSlice
);
