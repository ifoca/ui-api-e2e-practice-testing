import { test, expect } from '@fixtures/base.fixture';
import type { ProductsResponse } from '../../../library/types/api.types';

test.describe('Homepage validation tests based on intercepted /products API', async () => {
  test('Validate product data is visible in UI from API', async ({ homepage, captureResponse }) => {
    const productsPromise = captureResponse<ProductsResponse>('/products**');
    await homepage.gotoHomepage();
    const apiProducts = (await productsPromise).data;

    expect(homepage.productCard).toHaveCount(apiProducts.length);

    for (const product of apiProducts) {
      await expect(homepage.productsGrid).toContainText(product.name);
      await expect(homepage.productsGrid).toContainText(product.price.toString());
    }
  });
});
