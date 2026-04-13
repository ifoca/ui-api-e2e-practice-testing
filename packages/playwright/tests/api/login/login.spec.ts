import { test, expect } from '@fixtures/base.fixture';

const loginPath = '/users/login';

test.describe('Login validation messages', async () => {
  test('Email and password are required', async ({ apiContext }) => {
    const response = await apiContext.post(loginPath, {
      data: {
        email: '',
        password: '',
      },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toStrictEqual('Invalid login request');
  });

  test('Unauthorized returned with incorrect email and password', async ({ apiContext }) => {
    const response = await apiContext.post(loginPath, {
      data: {
        email: 'fake@email.com',
        password: 'fakepassword',
      },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toStrictEqual('Unauthorized');
  });
});
