import { expect, type Locator, type Page } from '@playwright/test';
import { expectNoBrokenImages } from '../../helpers/image.helper';

export class Homepage {
  public readonly page: Page;
  public readonly productsGrid: Locator;
  public readonly productCard: Locator;
  public readonly productPrice: Locator;
  public readonly maxPriceRange: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsGrid = page.locator('.col-md-9');
    this.productCard = page.locator('.card');
    // gets the price within the card locator
    this.productPrice = this.productCard.getByTestId('product-price');
    this.maxPriceRange = page.locator('.ngx-slider-pointer-max');
  }

  async gotoHomepage() {
    await this.page.goto('/');
  }

  async applyFilterLabel(labelName: string) {
    await this.page.getByLabel(labelName).check();
  }

  async getAllCards(): Promise<Locator[]> {
    // all() does not wait for locators, it returns the DOM directly
    return await this.productCard.all();
  }

  async getProductCardsCount(): Promise<number> {
    return await this.productCard.count();
  }

  async expectProductCount(number: Number) {
    const count = await this.getProductCardsCount();
    expect(count).toBe(number);
  }

  async expectNoBrokenProductImages() {
    await expectNoBrokenImages(this.productCard);
  }

  async expectEveryCardToHavePrice() {
    const cards = await this.getAllCards();
    expect(cards.length).toBeGreaterThan(0);

    for (const card of cards) {
      const price = card.getByTestId('product-price');
      await expect(price).toBeVisible();
    }
  }

  async expectEveryCardToHaveImage() {
    const cards = await this.getAllCards();
    expect(cards.length).toBeGreaterThan(0);

    for (const card of cards) {
      const image = card.locator('.card-img-wrapper');
      await expect(image).toBeVisible();
    }
  }

  // similar loop, but by checking the count
  async expectEveryCardToHaveName() {
    const cardsCount = await this.getProductCardsCount();

    for (let i = 0; i < cardsCount; i++) {
      await expect(this.productCard.nth(i).getByTestId('product-price')).toBeVisible();
    }
  }

  /*
  This method is not the most effective one because we are pressing the arrow left
  key multiple times, until we reach the desired number. This means that we are 
  making a request to the endpoint with every key press
  */
  async setMaxPriceRange(target: number) {
    await this.maxPriceRange.focus();

    let current = Number(await this.maxPriceRange.getAttribute('aria-valuenow'));
    while (current > target) {
      await this.maxPriceRange.press('ArrowLeft');
      current = Number(await this.maxPriceRange.getAttribute('aria-valuenow'));
    }
  }
}
