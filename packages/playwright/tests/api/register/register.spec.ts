import { test, expect } from '@fixtures/base.fixture';
import { registerUser } from '@dataFactory/apiRegister';

test.describe('Registration flow', () => {
  test('User registers successfully', async ({ apiContext }) => {
    const email = `test${Date.now()}@test.com`;
    const result = await registerUser(apiContext);

    console.log(result);

    expect(result.status).toBe(201);
    expect(result.registeredUser).toHaveProperty('id');
  });
});
