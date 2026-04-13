import { type Locator, type Page } from '@playwright/test';

export class Homepage {
  public readonly page: Page;
  public readonly productCard: Locator;
  public readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCard = page.locator('.card');
    // gets the price withing the card locator
    this.productPrice = this.productCard.getByTestId('product-price');
  }

  async gotoHomepage() {
    await this.page.goto('/');
  }
}
