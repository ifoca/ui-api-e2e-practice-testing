import { test, expect } from '@fixtures/base.fixture';

test.describe('Login validation messages', async () => {
  //   test.use({ storageState: '.auth/storage.json' });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.gotoLoginPage();
  });

  test('Email and password are required', async ({ loginPage }) => {
    await loginPage.login('', '');
    await expect(loginPage.emailErrorMessage).toContainText('Email is required');
    await expect(loginPage.passwordErrorMessage).toContainText('Password is required');
  });

  test('Invalid email address message is returned', async ({ loginPage }) => {
    await loginPage.login('fakeemail', '');
    await expect(loginPage.emailErrorMessage).toContainText('Email format is invalid');
  });

  test('Password length is invalid', async ({ loginPage }) => {
    await loginPage.login('fake@email.com', 'ab');
    await expect(loginPage.passwordErrorMessage).toHaveText('Password length is invalid');
  });

  test('User is redirected to the sign up page', async ({ loginPage, page }) => {
    await loginPage.clickRegisterLink();
    await expect(page).toHaveURL('/auth/register');
  });

  test('User is redirected to the password reset up page', async ({ loginPage, page }) => {
    await loginPage.clickForgotPasswordLink();
    await expect(page).toHaveURL('/auth/forgot-password');
  });
});
