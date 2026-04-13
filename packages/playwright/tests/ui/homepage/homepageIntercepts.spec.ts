import { test, expect } from '@fixtures/base.fixture';
import type { Product, ProductsResponse } from '../../../library/types/api.types';

test.describe('Homepage validation tests based on intercepted /products API', async () => {
  test.only('Validate product data is visible in UI from API', async ({
    homepage,
    page,
    captureResponse,
  }) => {
    const productsPromise = captureResponse<ProductsResponse>('/products**');
    await homepage.gotoHomepage();
    const apiProducts = await productsPromise;

    // ✅ TypeScript autocomplete works!
    console.log(apiProducts.data); // ✅ Known property

    const productGrid = page.locator('.col-md-9');

    for (const product of apiProducts.data) {
      await expect(productGrid).toContainText(product.name);
      await expect(productGrid).toContainText(product.price.toString());
    }
  });
});
