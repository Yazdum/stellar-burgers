import { combineReducers } from '@reduxjs/toolkit';

import { constructorReducer } from './slices/constructor';
import { feedReducer } from './slices/feed';
import { ingredientsReducer } from './slices/ingredients';
import { orderReducer } from './slices/order';
import { userReducer } from './slices/user';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  user: userReducer,
});
