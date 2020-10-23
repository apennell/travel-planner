// Test routes in server/app.js
const supertest = require('supertest');
const app = require('../server/app');
const request = supertest(app);

describe('GET / route', () => {
  it('successfully gets the endpoint', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });
});
