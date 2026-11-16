import {
  addIngredient,
  constructorReducer,
  moveIngredient,
  removeIngredient,
} from '../constructor';
import { createOrder } from '../order';

import type { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 50,
  image: '/favicon.ico',
  image_large: '/favicon.ico',
  image_mobile: '/favicon.ico',
};

const firstIngredient: TConstructorIngredient = {
  ...bun,
  _id: 'main-1',
  name: 'Первая начинка',
  type: 'main',
  id: 'constructor-1',
};

const secondIngredient: TConstructorIngredient = {
  ...firstIngredient,
  _id: 'main-2',
  name: 'Вторая начинка',
  id: 'constructor-2',
};

const order: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '2026-11-16T00:00:00.000Z',
  updatedAt: '2026-11-16T00:00:00.000Z',
  number: 424242,
  ingredients: [bun._id, firstIngredient._id, bun._id],
};

describe('Редьюсер конструктора бургера', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('добавляет булку', () => {
    const state = constructorReducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual(expect.objectContaining(bun));
    expect(state.bun?.id).toEqual(expect.any(String));
    expect(state.ingredients).toEqual([]);
  });

  test('добавляет начинку', () => {
    const state = constructorReducer(undefined, addIngredient(firstIngredient));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({
        _id: firstIngredient._id,
        name: firstIngredient.name,
        type: firstIngredient.type,
      })
    );
    expect(state.ingredients[0]?.id).toEqual(expect.any(String));
  });

  test('удаляет начинку', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient],
      },
      removeIngredient(firstIngredient.id)
    );

    expect(state.ingredients).toEqual([secondIngredient]);
  });

  test('перемещает начинку', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient],
      },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  test('очищает конструктор после успешного создания заказа', () => {
    const state = constructorReducer(
      {
        bun: { ...bun, id: 'bun-constructor' },
        ingredients: [firstIngredient],
      },
      createOrder.fulfilled(order, 'request-id', [bun._id, firstIngredient._id, bun._id])
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
