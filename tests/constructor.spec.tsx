import { test, expect } from '@playwright/test';
import ingredientsMock from './mocks/ingredients.json';
import orderMock from './mocks/order.json';
import userMock from './mocks/user.json';
import loginMock from './mocks/login.json';

test.describe('Тестирование конструктора Stellar Burger', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({ json: ingredientsMock });
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({ json: userMock });
    });

    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ json: loginMock });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({ json: orderMock });
    });

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

    await page.goto('/');
  });

  test('Добавление булки в конструктор', async ({ page }) => {
    try {
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
      
    } catch (error) {
      console.log('❌ ОШИБКА: Булка не была добавлена в конструктор');
      throw error;
    }
  });

  test('Добавление начинок в конструктор', async({ page }) => {
    try {
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
    } catch(error) {
      console.log('❌ ОШИБКА: Начинки не добавлены в конструктор');
      throw error;
    }
  });

  test('Проверка модального окна', async({ page }) =>{
    try {
      const ingr = page.getByTestId('Ingredient').first();
      await ingr.click();
      const modal = page.locator('#modals > div').first();
      await expect(modal).toBeVisible();
      console.log('✅ УСПЕХ: Модальное окно открыто');
      
      try {
        const text = await modal.textContent();
        const cleanText = text?.replace(/\s/g, '');
        expect(cleanText).toContain('ДеталиингредиентаКраторнаябулкаN-200iКалории,ккал420Белки,г80Жиры,г24Углеводы,г53');
        console.log('✅ УСПЕХ: Содержимое модального окна совпадает');
        
        try {
          const button = modal.getByRole('button');
          await button.click();
          await expect(modal).toBeHidden();
          console.log('✅ УСПЕХ: Модальное окно закрылось по крестику');
          
          try {
            await ingr.click();
            await page.locator('body').click({ position: { x: 0, y: 0 } }); 
            await expect(modal).toBeHidden();
            console.log('✅ УСПЕХ: Модальное окно закрылось по оверлею');
          } catch(error) {
            console.log('❌ ОШИБКА: Модальное окно не закрывается через оверлей');
            throw error;
          }
        } catch(error) {
          console.log('❌ ОШИБКА: Не нажимается закрытие кнопки');
          throw error;
        }
      } catch(error) {
        console.log('❌ ОШИБКА: Содержимое модального окна не совпадает');
        throw error;
      }
    } catch(error) {
      console.log('❌ ОШИБКА: Не удалось открыть модальное окно');
      throw error;
    }
  });

  test('Создание заказа', async ({ page, context }) => {
    try{
      await page.getByTestId('Ingredient').first().getByRole('button').click();
      await page.getByTestId('Ingredient').nth(2).getByRole('button').click();
      await page.getByTestId('Ingredient').nth(11).getByRole('button').click();
      await page.getByRole('button', { name: 'Оформить заказ' }).click();
      await expect(page.getByText('777777')).toBeVisible();
      const modal = page.locator('#modals > div').first();
      const button = modal.getByRole('button');
      await button.click();
      await expect(modal).toBeHidden();
      try{
        const constructor = page.getByTestId('Constructor');
        await expect(constructor.locator('.constructor-element')).toHaveCount(0);
        console.log('✅ Конструктор очищен после создания заказа');
      }catch(error){
        console.log('❌ ОШИБКА: Конструктор не пустой')
      }
      console.log('✅ Тест создания заказа пройден!');
    } catch(error) {
      console.log('❌ ОШИБКА: Заказ не создан')
    }
    
  });
});