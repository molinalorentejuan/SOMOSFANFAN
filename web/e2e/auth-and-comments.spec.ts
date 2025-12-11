import { test, expect } from '@playwright/test';

test('la pagina principal carga y muestra la lista de restaurantes', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TailorHub/i); // Ajustar al título real de tu <title>
    await expect(page.locator('a[href^="/restaurants/"]').first()).toBeVisible();
});

test('la página de autenticación carga y muestra el botón de registro', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByRole('button', { name: 'Regístrate' })).toBeVisible();
});

test('la página de detalle de un restaurante carga correctamente', async ({ page }) => {
    await page.goto('/');
    const first = page.locator('a[href^="/restaurants/"]').first();
    await first.click();
    await expect(page.locator('h1')).toBeVisible();
});

test('la navegación funciona desde inicio hasta auth y de vuelta', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/auth"]'); // enlace hacia login/registro
    await expect(page).toHaveURL(/.*\/auth/);

    // Volver a la página principal
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
});

test('cada tarjeta de restaurante muestra nombre e imagen', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('a[href^="/restaurants/"]').first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('h2, h3')).toBeVisible(); // el título está en un h2 o h3
});

test('en la página de un restaurante no aparece la caja de comentarios (sin loguearse)', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href^="/restaurants/"]').first().click();

    // Comprueba directamente que no existe ningún textarea con placeholder "comentario"
    const count = await page.getByPlaceholder(/comentario/i).count();
    expect(count).toBe(0);
});