// tests/constructor.spec.tsx
import { test, expect } from '@playwright/test';

// Фейковый пользователь
const fakeUser = {
  email: 'test',
  name: 'TEST',
  id: 'test-user-id'
};

test.describe('Тестирование конструктора Stellar Burger с HAR', () => {
  
  test.beforeEach(async ({ page, context }) => {
    // Мокаем получение пользователя
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({ 
        status: 200, 
        json: { 
          success: true, 
          user: fakeUser 
        } 
      });
    });

    // Устанавливаем токены
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'test-accessToken',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', JSON.stringify('test-refreshToken'));
    });

    // Ингредиенты и заказы через HAR
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });
    
    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
    });
    
    // Открываем главную страницу
    await page.goto('/');
    
    // Ждём загрузки ингредиентов
    await expect(page.getByTestId('Ingredientsn')).toBeVisible({ timeout: 10000 });
  });

  test('Добавление булки в конструктор', async ({ page }) => {
    const bun = page.getByTestId('Ingredient').first();
    const button = bun.getByRole('button');
    await button.click();
    
    const constructor = page.getByTestId('Constructor');
    const topBun = constructor.locator('> div')
      .first()
      .locator('.constructor-element__text');
    const bottomBun = constructor.locator('> div')
      .nth(1)
      .locator('.constructor-element__text');
    
    await expect(topBun).toHaveText('Краторная булка N-200i (верх)');
    await expect(bottomBun).toHaveText('Краторная булка N-200i (низ)');
    
    console.log('✅ УСПЕХ: Обе булки успешно добавлены в конструктор!');
  });

  test('Добавление начинок в конструктор', async({ page }) => {
    const meat = page.getByTestId('Ingredient').nth(2);
    const meatButton = meat.getByRole('button');
    await meatButton.click();

    const souce = page.getByTestId('Ingredient').nth(11);
    const souceButton = souce.getByRole('button');
    await souceButton.click();
    
    const constructor = page.getByTestId('Constructor');
    const meatIng = constructor
      .locator('> ul')
      .locator('> li')
      .first()
      .locator('.constructor-element__text');
    const souceIng = constructor
      .locator('> ul')
      .locator('> li')
      .last()
      .locator('.constructor-element__text');
    
    await expect(meatIng).toHaveText('Биокотлета из марсианской Магнолии');
    await expect(souceIng).toHaveText('Соус Spicy-X');
    console.log('✅ УСПЕХ: Начинки успешно добавлены в конструктор!');
  });

  test('Проверка модального окна', async({ page }) => {
    const ingr = page.getByTestId('Ingredient').first();
    await ingr.click();
    const modal = page.locator('#modals > div').first();
    await expect(modal).toBeVisible();
    console.log('✅ УСПЕХ: Модальное окно открыто');
    
    const text = await modal.textContent();
    const cleanText = text?.replace(/\s/g, '');
    expect(cleanText).toContain('ДеталиингредиентаКраторнаябулкаN-200iКалории,ккал420Белки,г80Жиры,г24Углеводы,г53');
    console.log('✅ УСПЕХ: Содержимое модального окна совпадает');
    
    const button = modal.getByRole('button');
    await button.click();
    await expect(modal).toBeHidden();
    console.log('✅ УСПЕХ: Модальное окно закрылось по крестику');
    
    await ingr.click();
    await page.locator('body').click({ position: { x: 0, y: 0 } }); 
    await expect(modal).toBeHidden();
    console.log('✅ УСПЕХ: Модальное окно закрылось по оверлею');
  });

  test('Создание заказа', async ({ page }) => {
    // Добавляем ингредиенты в конструктор
    await page.getByTestId('Ingredient').first().getByRole('button').click();
    await page.getByTestId('Ingredient').nth(2).getByRole('button').click();
    await page.getByTestId('Ingredient').nth(11).getByRole('button').click();
    
    // Кликаем кнопку оформления заказа внутри конструктора
    const constructor = page.getByTestId('Constructor');
    const orderButton = constructor.getByRole('button', { name: 'Оформить заказ' });
    await orderButton.click();
    
    // Ждём появления модального окна
    const modal = page.locator('#modals > div').first();
    await expect(modal).toBeVisible({ timeout: 30000 });
    
    // Ищем номер заказа ТОЛЬКО внутри модального окна
    const orderNumber = modal.locator('text=/\\d{5,}/');
    await expect(orderNumber).toBeVisible({ timeout: 30000 });
    const orderNumberText = await orderNumber.textContent();
    console.log(`✅ Заказ создан! Номер заказа: ${orderNumberText}`);
    
    // Закрываем модальное окно
    const closeButton = modal.getByRole('button');
    await closeButton.click();
    await expect(modal).toBeHidden();
    
    // Проверяем, что конструктор очистился (если не очистится - тест упадёт)
    await expect(constructor.locator('.constructor-element')).toHaveCount(0);
    console.log('✅ Конструктор очищен после создания заказа');
    console.log('✅ Тест создания заказа пройден!');
  });
});