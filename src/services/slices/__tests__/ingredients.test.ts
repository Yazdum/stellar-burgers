import { fetchIngredients, ingredientsReducer } from '../ingredients';

import type { TIngredient } from '@utils-types';

const ingredients: TIngredient[] = [
  {
    _id: 'ingredient-1',
    name: 'Тестовый ингредиент',
    type: 'main',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 50,
    image: '/favicon.ico',
    image_large: '/favicon.ico',
    image_mobile: '/favicon.ico',
  },
];

describe('Редьюсер ингредиентов', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      items: [],
      isLoading: true,
      error: null,
    });
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      {
        items: ingredients,
        isLoading: false,
        error: { message: 'Ошибка' },
      },
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state).toEqual({
      items: ingredients,
      isLoading: true,
      error: null,
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(ingredients, 'request-id', undefined)
    );

    expect(state).toEqual({
      items: ingredients,
      isLoading: false,
      error: null,
    });
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const action = fetchIngredients.rejected(
      new Error('Ошибка загрузки'),
      'request-id',
      undefined
    );
    const state = ingredientsReducer(undefined, action);

    expect(state.items).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual(action.error);
  });
});
