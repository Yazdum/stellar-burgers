import { expect, test } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

const bunName = 'Тестовая булка';
const mainName = 'Тестовая начинка';
const orderNumber = 424242;

const mockApi = async (page: Page): Promise<void> => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
  });
  await page.routeFromHAR('tests/hars/user.har', {
    url: '**/api/auth/user',
  });
  await page.routeFromHAR('tests/hars/orders.har', {
    url: '**/api/orders*',
  });
};

const addIngredient = async (page: Page, ingredientName: string): Promise<void> => {
  await page
    .getByRole('listitem')
    .filter({ hasText: ingredientName })
    .getByRole('button', { name: 'Добавить' })
    .click();
};

const getConstructor = (page: Page): Locator =>
  page
    .locator('section')
    .filter({ has: page.getByRole('button', { name: 'Оформить заказ' }) });

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
});

test.describe('Добавление ингредиентов в конструктор', () => {
  test('добавляет булку и начинку', async ({ page }) => {
    await addIngredient(page, bunName);
    await addIngredient(page, mainName);

    const constructor = getConstructor(page);

    await expect(constructor.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${bunName} (низ)`)).toBeVisible();
    await expect(constructor.getByText(mainName, { exact: true })).toBeVisible();
  });
});

test.describe('Модальное окно ингредиента', () => {
  test('открывает данные выбранного ингредиента и закрывается по крестику', async ({
    page,
  }) => {
    await page.getByText(mainName, { exact: true }).click();

    const modal = page.locator('#modals');
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByRole('heading', { name: mainName })).toBeVisible();
    await expect(modal.getByText('222', { exact: true })).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal).toBeEmpty();
  });

  test('закрывается по клику на оверлей', async ({ page }) => {
    await page.getByText(bunName, { exact: true }).click();
    await expect(
      page.locator('#modals').getByRole('heading', { name: bunName })
    ).toBeVisible();

    await page
      .locator('#modals > div')
      .last()
      .click({ position: { x: 5, y: 5 } });
    await expect(page.locator('#modals')).toBeEmpty();
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer mock-access-token',
        url: 'http://localhost:4000',
      },
    ]);
    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
    await page.reload();
  });

  test('показывает верный номер заказа и очищает конструктор', async ({ page }) => {
    await addIngredient(page, bunName);
    await addIngredient(page, mainName);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');
    const constructor = getConstructor(page);
    await expect(modal.getByText(String(orderNumber), { exact: true })).toBeVisible();
    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();
    await expect(constructor.getByText(bunName, { exact: false })).toHaveCount(0);
    await expect(constructor.getByText(mainName, { exact: true })).toHaveCount(0);

    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal).toBeEmpty();
  });
});
