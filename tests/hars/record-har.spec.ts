// tests/hars/record-har.spec.ts
import { test, expect } from '@playwright/test';

test('Запись всех HAR для конструктора', async ({ page, context }) => {
  test.setTimeout(120000);
  
  console.log('🚀 Начинаем запись HAR...');
  
  // 1. Сначала выполняем реальный логин
  console.log('📍 Шаг 1: Выполняем реальный логин...');
  await page.goto('/login');
  await page.fill('input[name="email"]', 'tesssst'); //фейковые данные
  await page.fill('input[name="password"]', 'tesssst'); //фейковые данные
  await page.click('button[type="submit"]');
  
  // Ждём редиректа на главную
  await expect(page).toHaveURL('/', { timeout: 10000 });
  console.log('✅ Реальный логин выполнен успешно');
  
  // 3. Теперь включаем запись HAR
  console.log('📍 Шаг 3: Начинаем запись HAR...');
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: true,
  });
  
  await page.routeFromHAR('./tests/hars/order.har', {
    url: '**/api/orders',
    update: true,
  });
  
  // 4. Обновляем страницу, чтобы запросы попали в HAR
  console.log('📍 Шаг 4: Обновляем страницу...');
  await page.reload();
  
  // Ждём загрузки ингредиентов
  await expect(page.getByTestId('Ingredientsn')).toBeVisible({ timeout: 10000 });
  console.log('✅ Ингредиенты загружены');
  
  // 5. Добавляем ингредиенты в конструктор
  console.log('📍 Шаг 5: Добавляем ингредиенты...');
  await page.getByTestId('Ingredient').first().getByRole('button').click();
  await page.getByTestId('Ingredient').nth(2).getByRole('button').click();
  await page.getByTestId('Ingredient').nth(11).getByRole('button').click();
  console.log('✅ Ингредиенты добавлены');
  
  // 6. Оформляем заказ
  console.log('📍 Шаг 6: Оформляем заказ...');
  await page.getByRole('button', { name: 'Оформить заказ' }).click();
  
  // Ждём появления модального окна
  const modal = page.locator('#modals > div').first();
  await expect(modal).toBeVisible({ timeout: 30000 });
  console.log('✅ Модальное окно появилось');
  
  // Ждём появления номера заказа
  const orderNumber = modal.locator('text=/\\d{5,}/');
  await expect(orderNumber).toBeVisible({ timeout: 30000 });
  const orderNumberText = await orderNumber.textContent();
  console.log(`✅ Заказ оформлен! Номер заказа: ${orderNumberText}`);
  
  console.log('✅ Все HAR-файлы успешно записаны!');
});