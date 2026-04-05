const request = require('supertest');
const users = require('../../../../shared/fixtures/users.json');

const BASE_URL = 'https://api.practicesoftwaretesting.com';

describe('Auth API — async JWT flow', () => {
  let token;

  test('POST /users/login returns JWT token', async () => {
    const res = await request(BASE_URL)
      .post('/users/login')
      .send(users.validUser)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    token = res.body.access_token; // save for next test
    console.log(res.body);
  });

  test('JWT token allows access to protected route', async () => {
    const res = await request(BASE_URL).get('/users/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(users.validUser.email);
    console.log(res.body.email);
  });

  test('Invalid credentials return 401', async () => {
    const res = await request(BASE_URL).post('/users/login').send(users.invalidUser);

    expect(res.status).toBe(401);
    console.log(res.error);
  });
});
