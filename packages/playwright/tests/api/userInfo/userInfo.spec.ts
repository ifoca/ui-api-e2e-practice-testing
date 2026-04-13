import { test, expect } from '@fixtures/base.fixture';

test.describe('User information tests', () => {
  test('users/me cannot be accessed by logged out users', async ({ apiContext }) => {
    const response = await apiContext.get('/users/me');
    expect(response.status()).toBe(401);
  });

  test('users/me is accessible by logged in users', async ({ apiContextWithAuth }) => {
    const response = await apiContextWithAuth.get('/users/me');
    expect(response.status()).toBe(200);
  });
});
