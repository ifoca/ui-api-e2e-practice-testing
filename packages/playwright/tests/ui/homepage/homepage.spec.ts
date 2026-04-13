import { test, expect } from '@fixtures/base.fixture';
import type { Product, ProductsResponse } from '../../../library/types/api.types';

test.describe('Homepage UI tests', async () => {
  test.beforeEach(async ({ homepage }) => {
    await homepage.gotoHomepage();
    await expect(homepage.productCard).not.toHaveCount(0);
  });

  test.describe('Homepage product cards content tests', async () => {
    test('Should display a price on every product card', async ({ page }) => {
      // all() does not wait for locators, it returns the DOM directly
      const cards = await page.locator('.card').all();
      expect(cards.length).toBeGreaterThan(0);

      for (const card of cards) {
        const price = card.getByTestId('product-price');
        await expect(price).toBeVisible();
      }
    });

    test('Should display a name on every product card', async ({ page }) => {
      const cards = await page.locator('.card').all();

      for (const card of cards) {
        const name = card.getByTestId('product-name');
        await expect(name).toBeVisible();
      }
    });

    test('Should display an image on every product card', async ({ page }) => {
      const cards = await page.locator('.card').all();
      for (const card of cards) {
        const image = card.locator('.card-img-wrapper');
        await expect(image).toBeVisible();
      }
    });

    test('Product cards should not have broken images', { tag: '@only' }, async ({ page }) => {
      const images = page.locator('.card img');
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const isBroken = await images.nth(i).evaluate((img: HTMLImageElement) => {
          return img.naturalWidth === 0 || img.naturalHeight === 0;
        });
        expect(isBroken).toBe(false);
      }
    });
    /*
  locator.evaluate(fn) runs a function inside the browser (DOM context), 
  not in your test (Node.js).
  - images.nth(i) - selects the element using Playwright
  - we find the DOM element identified with the playwright locator page.locator('.card img')
  and pass it to the evaluate function, so not this becomes an HTML element: <img src="..." />, a real DOM object
  - .evaluate(...) - tells Playwright to take the DOM element and run a function on it inside the browser,
  and now we have access to DOM properties, such as .naturalWidth, .alt etc.
  - then with the return statement we pass back the data to playwright test
  */

    //   test('Compare ?');
  });

  test.describe('Homepage filter tests', async () => {
    test.only('Select Screwdriver', async ({ page, homepage, captureResponse }) => {
      const productsPromise = captureResponse<ProductsResponse>('/products**');
      await page.getByLabel('Screwdriver').check();
      const apiProducts = (await productsPromise).data;
      await expect(homepage.productCard).toHaveCount(apiProducts.length);

      const cards = await page.locator('.card').all();

      for (const card of cards) {
        const name = card.getByTestId('product-name');
        await expect(name).toContainText('Screwdriver');
      }
    });
  });

  test.describe('Homepage search item tests', async () => {});

  test.describe('Homepage price range tests', async () => {});

  test.describe('Homepage sorting tests', async () => {});

  test.describe('Homepage pagination tests', async () => {});
});
