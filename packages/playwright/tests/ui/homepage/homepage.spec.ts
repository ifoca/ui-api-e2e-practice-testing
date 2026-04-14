import { test, expect } from '@fixtures/base.fixture';
import type { Category, ProductsResponse } from '../../../library/types/api.types';

test.describe('Homepage UI tests', async () => {
  test.beforeEach(async ({ homepage }) => {
    await homepage.gotoHomepage();
    await expect(homepage.productCard).not.toHaveCount(0);
  });

  test.describe('Homepage product cards content tests', async () => {
    test('Should display a price on every product card', async ({ homepage }) => {
      await homepage.expectEveryCardToHavePrice();
    });

    test('Should display a name on every product card', async ({ homepage }) => {
      await homepage.expectEveryCardToHaveName();
    });

    test('Should display an image on every product card', async ({ homepage }) => {
      await homepage.expectEveryCardToHaveImage();
    });

    test('Product cards should not have broken images', { tag: '@only' }, async ({ homepage }) => {
      await homepage.expectNoBrokenProductImages();
    });

    //   test('Compare ?');
  });

  test.describe('Homepage filter tests', async () => {
    const screwdriver = 'Screwdriver';
    test(`Select "${screwdriver}" filter`, async ({ page, homepage, captureResponse }) => {
      const productsPromise = captureResponse<ProductsResponse>('/products**');
      homepage.applyFilterLabel(screwdriver);
      const apiProducts = (await productsPromise).data;
      await homepage.expectProductCount(apiProducts.length);

      const cards = await homepage.getAllCards();

      // Checks that each product card contains the name of the filter
      for (const card of cards) {
        const name = card.getByTestId('product-name');
        await expect(name).toContainText(screwdriver);
      }
      await homepage.expectNoBrokenProductImages();
    });

    const ecoFriendlyProducts = 'Show only eco-friendly products';
    test(`Select "${ecoFriendlyProducts}" filter`, async ({ page, homepage, captureResponse }) => {
      const productsPromise = captureResponse<ProductsResponse>('/products*&eco_friendly=true&*');
      homepage.applyFilterLabel(ecoFriendlyProducts);
      const apiProducts = (await productsPromise).data;
      await homepage.expectProductCount(apiProducts.length);

      // checks that each product in the api response contains the eco friendly property
      for (const product of apiProducts) {
        expect(product.is_eco_friendly).toBe(true);
      }

      const cards = await page.locator('.card').all();

      // checks in the UI that every product card has the 'eco' badge
      for (const card of cards) {
        expect(card.getByTestId('eco-badge')).toBeVisible();
        expect(card.getByTestId('eco-badge')).toContainText('ECO');
      }
    });

    const drill = 'Drill';
    test(`Select "${drill}" filter`, async ({ page, homepage, apiContext, captureResponse }) => {
      const categorySearchResponse = await apiContext.get('/categories/search', {
        params: `q=${drill}`,
      });
      expect(categorySearchResponse.status()).toBe(200);
      // destructuring the response because we can have an array of categories
      const [data] = (await categorySearchResponse.json()) as Category[];
      expect(data.name).toBe(drill);

      // Intercept the request with the category id
      const categoryId = data.id;
      const productsPromise = captureResponse<ProductsResponse>(
        `/products*by_category=${categoryId}&*`,
      );
      homepage.applyFilterLabel(drill);
      const apiProducts = (await productsPromise).data;

      await homepage.expectProductCount(apiProducts.length);

      // check for each product in the api to have the property id and
      // to have the same category id as the selected one
      for (const product of apiProducts) {
        expect(product.category).toHaveProperty('id');
        expect(product.category.id).toBe(categoryId);
      }

      const cards = await page.locator('.card').all();

      for (const card of cards) {
        await expect(card.getByTestId('product-name')).toContainText(drill);
      }
    });
  });

  test.describe('Homepage search item/s tests', async () => {
    // test('');
    // search for a specific name, expect it to be the first one in the list
    // search for hammer, loop through the items in the api for the category id
    // and make a soft assertion, flagging which item does not have such category
  });

  test.describe('Homepage price range tests', async () => {
    const max = 9;
    test(`Products should be max ${max}`, async ({ page, homepage, captureResponse }) => {
      // intercept the request with the max price query param
      const productsPromise = captureResponse<ProductsResponse>(
        `/products*between=price,1,${max}&**`,
      );

      // set the query param to a max
      await homepage.setMaxPriceRange(max);

      // resolve the intercepted request
      const apiProducts = (await productsPromise).data;

      // assert that there are some cards returned once the api response is returned
      await homepage.expectProductCount(apiProducts.length);

      // check that the api products have a price <= to the max one
      for (const product of apiProducts) {
        expect(product.price).toBeLessThanOrEqual(max);
      }
      // get all the cards
      const cards = await page.locator('.card').all();
      // randomly check for 1 card vs 1 product in the api
      expect(cards[0].getByTestId('product-price')).toContainText(apiProducts[0].price.toString());
    });
  });

  test.describe('Homepage sorting tests', async () => {});

  test.describe('Homepage pagination tests', async () => {});
});
