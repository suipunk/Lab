const { test, expect } = require('@playwright/test');
const path = require('path');

test('Успішна генерація інтервалу та перевірка відповіді', async ({ page }) => {
    // 1. Робот відкриває наш локальний файл index.html
    const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
    await page.goto(filePath);

    // Перевіряємо, чи сторінка взагалі завантажилась (шукаємо заголовок)
    await expect(page.locator('h2')).toHaveText('🎵 Simple Interval Trainer');

    // 2. Робот натискає кнопку "Play New Interval"
    await page.click('#btn-play');

    // Перевіряємо, що після кліку з'явилося поле для вводу відповіді
    const answerSection = page.locator('#answer-section');
    await expect(answerSection).toBeVisible();

    // 3. Робот вводить текст у поле (наприклад, "P5")
    await page.fill('#input-answer', 'P5');

    // Робот натискає кнопку "Check"
    await page.click('#btn-check');

    // 4. Перевіряємо, чи зарахувалася спроба в таблиці результатів (Total)
    // Оскільки ми клікнули "Check" один раз, Total має стати "1"
    await expect(page.locator('#score-total')).toHaveText('1');
});