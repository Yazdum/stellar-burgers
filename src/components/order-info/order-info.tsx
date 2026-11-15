import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
  selectFeedOrders,
  selectIngredients,
  selectSelectedOrder,
  selectUserOrders,
} from '@services/selectors';
import { fetchOrderByNumber } from '@services/slices/feed';
import { useDispatch, useSelector } from '@services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);
  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const selectedOrder = useSelector(selectSelectedOrder);
  const orderData =
    [...feedOrders, ...userOrders].find((order) => order.number === orderNumber) ??
    (selectedOrder?.number === orderNumber ? selectedOrder : null);

  useEffect(() => {
    if (!orderData && Number.isFinite(orderNumber)) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce<TIngredientsWithCount>(
      (acc, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
