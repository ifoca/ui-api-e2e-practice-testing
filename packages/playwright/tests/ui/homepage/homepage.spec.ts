import { test, expect } from '@fixtures/base.fixture';
import type { Category, ProductsResponse } from '../../../library/types/api.types';

test.describe('Homepage UI tests', async () => {
  test.beforeEach(async ({ homepage }) => {
    await homepage.gotoHomepage();
    await homepage.expectCardsNotToHaveCount(0);
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
      await homepage.expectNoBrokenCardImages();
    });

    //   test('Compare ?');
  });

  test.describe('Homepage filter tests', async () => {
    const screwdriver = 'Screwdriver';
    test(`Select "${screwdriver}" filter`, async ({ homepage, captureResponse }) => {
      const productsPromise = captureResponse<ProductsResponse>('/products**');
      await homepage.applyFilterLabel(screwdriver);
      const apiProducts = (await productsPromise).data;
      await homepage.expectCardsToHaveCount(apiProducts.length);

      // Checks that each product card contains the name of the filter
      await homepage.expectCardNameToHaveText(screwdriver);
    });

    const ecoFriendlyProducts = 'Show only eco-friendly products';
    test(`Select "${ecoFriendlyProducts}" filter`, async ({ homepage, captureResponse }) => {
      const productsPromise = captureResponse<ProductsResponse>('/products*&eco_friendly=true&*');
      await homepage.applyFilterLabel(ecoFriendlyProducts);
      const apiProducts = (await productsPromise).data;
      await homepage.expectCardsToHaveCount(apiProducts.length);
      await homepage.expectEveryCardToHaveEcoBadge();

      // checks that each product in the api response contains the eco friendly property
      for (const product of apiProducts) {
        expect(product.is_eco_friendly).toBe(true);
      }
    });

    const drill = 'Drill';
    test(`Select "${drill}" filter`, async ({ homepage, apiContext, captureResponse }) => {
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
      await homepage.expectCardsToHaveCount(apiProducts.length);
      await homepage.expectCardNameToHaveText(drill);

      // check for each product in the api to have the property id and
      // to have the same category id as the selected one
      for (const product of apiProducts) {
        expect(product.category).toHaveProperty('id');
        expect(product.category.id).toBe(categoryId);
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
    const maxPrice = 9;
    test(`Products should be max ${maxPrice}`, async ({ page, homepage, captureResponse }) => {
      const productsPromise = captureResponse<ProductsResponse>(
        `/products*between=price,1,${maxPrice}&**`,
      );

      await homepage.setMaxPriceRange(maxPrice);
      const apiProducts = (await productsPromise).data;
      await homepage.expectCardsToHaveCount(apiProducts.length);

      for (const product of apiProducts) {
        expect(product.price).toBeLessThanOrEqual(maxPrice);
      }

      // get all the cards
      const cards = await page.locator('.card').all();
      // randomly check for 1 card vs 1 product in the api
      expect(cards[2].getByTestId('product-price')).toContainText(apiProducts[2].price.toString());
    });
  });

  test.describe('Homepage sorting tests', async () => {});

  test.describe('Homepage pagination tests', async () => {});
});
