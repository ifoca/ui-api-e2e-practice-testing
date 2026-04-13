import { test as base, request as baseRequest } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { readFile, mkdir } from 'fs/promises';
dotenv.config({ path: resolve(__dirname, '../../../.env') });

const AUTH_DIR = resolve(__dirname, '../../.auth');
const TOKEN_FILE = resolve(AUTH_DIR, 'token.json');

type Fixtures = {
  apiContext: APIRequestContext;
  apiContextWithAuth: APIRequestContext;
};

// we create a new test object which will extend the default playwright test
export const test = base.extend<Fixtures>({
  // create new fixture called apiContext, which will take 2 arguments:
  // the first one is an object which can take other fixture that this might depend on
  // and a second argument use, is a callback function provided by playwright which allows you
  // to expose fixtures to the test, apiContext in this case
  apiContext: async ({}, use) => {
    // we define the request context, which takes multiple arguments, such as the api url
    // and other arguments, such as http headers
    const context = await baseRequest.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    // we hand over the request context data to the use callback function
    await use(context);

    // this method discards all the methods available to the api context
    await context.dispose();
  },

  // create new fixture called apiContextWithAuth, which will take 2 arguments:
  // the first one is an object which can take other fixture that this might depend on
  // and a second argument use, is a callback function provided by playwright which allows you
  // to expose fixtures to the test, apiContext in this case
  apiContextWithAuth: async ({}, use) => {
    await mkdir(AUTH_DIR, { recursive: true });

    // Reads from the token file and gets the access_token
    const raw = await readFile(TOKEN_FILE, 'utf-8');
    const { access_token } = await JSON.parse(raw);

    const context = await baseRequest.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // attaches the access_token to the request
        Authorization: `Bearer ${access_token}`,
      },
    });
    await use(context);
    await context.dispose();
  },
});

export { expect } from '@playwright/test';
