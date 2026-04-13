import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  public readonly page: Page;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginButton: Locator;
  public readonly emailErrorMessage: Locator;
  public readonly passwordErrorMessage: Locator;
  public readonly registerLink: Locator;
  public readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-submit');
    this.emailErrorMessage = page.getByTestId('email-error');
    this.passwordErrorMessage = page.getByTestId('password-error');
    this.registerLink = page.getByTestId('register-link');
    this.forgotPasswordLink = page.getByTestId('forgot-password-link');
  }

  async gotoLoginPage() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async clickForgotPasswordLink() {
    await this.forgotPasswordLink.click();
  }
}
