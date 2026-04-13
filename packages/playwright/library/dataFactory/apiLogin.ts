import type { APIRequestContext } from '@playwright/test';
import { writeFile, mkdir } from 'fs/promises';
import { resolve } from 'path';

const AUTH_DIR = resolve(__dirname, '../../.auth');
const TOKEN_FILE = resolve(AUTH_DIR, 'token.json');

export const apiLogin = async (apiContext: APIRequestContext, email: string, password: string) => {
  // create .auth directory if it does not exist
  await mkdir(AUTH_DIR, { recursive: true });

  const response = await apiContext.post('/users/login', {
    data: {
      email,
      password,
    },
  });

  if (!response.ok()) {
    // Fail if the login does not succeed
    throw new Error(`Login failed with status ${response.status()}, ${await response.text()}`);
  }

  const loggedInUser = await response.json();

  const accessToken = {
    access_token: loggedInUser.access_token,
  };

  await writeFile(TOKEN_FILE, JSON.stringify(accessToken, null, 2));

  return {
    status: response.status(),
    loggedInUser,
  };
};
