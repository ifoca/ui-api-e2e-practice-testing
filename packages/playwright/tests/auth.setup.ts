// import { readFile, writeFile, mkdir } from 'fs/promises';
// import { resolve } from 'path';
// import { test as setup, expect } from '@fixtures/base.fixture';
// import { registerUser } from '@datafactory/apiRegister';
// import { apiLogin } from '@datafactory/apiLogin';

// setup(
//   'Register new user, log in and save storage state',
//   async ({ apiContext, loginPage, page, context }) => {
//     const AUTH_DIR = resolve(__dirname, '../.auth');
//     const USER_FILE = resolve(AUTH_DIR, 'user.json');
//     const STORAGE_STAGE = resolve(AUTH_DIR, 'storage.json');

//     // Register new user via API
//     const registerResponse = await registerUser(apiContext);
//     expect(registerResponse.status).toBe(201);

//     // Gets the email, password and name from the file written with the registration
//     const raw = await readFile(USER_FILE, 'utf-8');
//     const { email, password, first_name, last_name } = await JSON.parse(raw);

//     // Log in with the new user via API
//     const loginResponse = await apiLogin(apiContext, email, password);
//     expect(loginResponse.status).toBe(200);
//     expect(loginResponse.loggedInUser).toHaveProperty('access_token');

//     // Log in with the new user via he UI
//     await loginPage.gotoLoginPage();
//     await loginPage.login(email, password);
//     await expect(page.getByTestId('nav-menu')).toContainText(`${first_name} ${last_name}`);
//     await page.waitForURL('/account');

//     // Saves the browser storage state into a file (cookies, local storage etc.)
//     await context.storageState({ path: STORAGE_STAGE });
//   },
// );
