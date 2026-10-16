import { test } from '@playwright/test';

test('Debug Add Employee in UI Mode', async ({ page }) => {

    await page.goto('https://ascendqe.org/');

    // Login
    await page.getByPlaceholder('Username').fill('AscendQETest');
    await page.getByPlaceholder('Password').fill('@Ascendqe123');
    await page.getByRole('button', { name: 'Login' }).click();

    // PIM
    await page.getByText('PIM', { exact: true }).click();

    // Stop here and inspect PIM screen
    await page.pause();

    // Click Add
    await page.getByRole('button', { name: /Add/i }).click();

    // Stop immediately after Add
    await page.pause();
});