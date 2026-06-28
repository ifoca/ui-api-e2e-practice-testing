import { STORAGE_FILE } from 'library/config/filePaths';
import { test as setup, expect } from '@fixtures/base.fixture';
import { registerUser } from '@dataFactory/apiRegister';
import { apiLogin } from '@dataFactory/apiLogin';

setup(
  'Register new user, log in and save storage state',
  async ({ apiContext, loginPage, page, context }) => {
    // Register new user via API
    const registerResponse = await registerUser(apiContext);
    expect(registerResponse.status).toBe(201);

    const { email, password } = registerResponse.credentials;
    const { first_name, last_name } = registerResponse.registeredUser;

    // Log in with the new user via API
    const loginResponse = await apiLogin(apiContext, email, password);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.loggedInUser).toHaveProperty('access_token');

    // Log in with the new user via he UI
    await loginPage.gotoLoginPage();
    await loginPage.login(email, password);
    await page.waitForURL('/account');
    await expect(page.getByTestId('nav-menu')).toContainText(`${first_name} ${last_name}`);

    // Saves the browser storage state into a file (cookies, local storage etc.)
    await context.storageState({ path: STORAGE_FILE });
  },
);
