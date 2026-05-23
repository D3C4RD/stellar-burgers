// e2e/tests/record-har.spec.ts
import { test, expect } from '@playwright/test';

test('должен записать HAR-файл для API бургерной', async ({ page, context }) => {
  // Настраиваем токены для авторизации (если нужны)
  // Начинаем запись HAR для ингредиентов
  

  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: true, // Режим записи
  });

  // Записываем HAR для заказов
  await page.routeFromHAR('./tests/hars/orders.har', {
    url: '**/api/orders',
    update: true,
  });

  // Переходим на главную страницу
  await page.goto('http://localhost:4000');
  
  // Ждём загрузки ингредиентов
  await expect(page.getByTestId('Ingredient').first()).toBeVisible();
  
  // Выполняем действия для записи всех API запросов
  // 1. Добавляем булку
  const bun = page.getByTestId('Ingredient').filter({ hasText: 'Краторная булка' }).first();
  await bun.getByRole('button').click();
  
  // 2. Добавляем начинку
  const filling = page.getByTestId('Ingredient').filter({ hasText: 'Биокотлета' }).first();
  await filling.getByRole('button').click();
  
  // 3. Добавляем соус
  const sauce = page.getByTestId('Ingredient').filter({ hasText: 'Соус Spicy-X' }).first();
  await sauce.getByRole('button').click();
  
  // 4. Открываем модальное окно ингредиента
  await page.getByTestId('Ingredient').first().click();
  await page.waitForTimeout(500);
  
  // 5. Закрываем модальное окно
  const modal = page.locator('#modals > div').first();
  await modal.getByRole('button').click();
  
  // HAR-файлы будут сохранены автоматически после теста
  console.log('✅ HAR файлы успешно записаны!');
});