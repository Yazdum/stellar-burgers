import type { RootState } from './store';
import type { SerializedError } from '@reduxjs/toolkit';

export const selectIngredients = (state: RootState): RootState['ingredients']['items'] =>
  state.ingredients.items;
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState): SerializedError | null =>
  state.ingredients.error;
export const selectConstructor = (state: RootState): RootState['burgerConstructor'] =>
  state.burgerConstructor;
export const selectOrder = (state: RootState): RootState['order']['data'] =>
  state.order.data;
export const selectOrderLoading = (state: RootState): boolean => state.order.isLoading;
export const selectFeed = (state: RootState): RootState['feed'] => state.feed;
export const selectFeedOrders = (state: RootState): RootState['feed']['orders'] =>
  state.feed.orders;
export const selectUserOrders = (state: RootState): RootState['feed']['userOrders'] =>
  state.feed.userOrders;
export const selectSelectedOrder = (
  state: RootState
): RootState['feed']['selectedOrder'] => state.feed.selectedOrder;
export const selectUser = (state: RootState): RootState['user']['user'] =>
  state.user.user;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const selectUserError = (state: RootState): string | null => state.user.error;
