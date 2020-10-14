const supertest = require('supertest');
const app = require('./app');
const request = supertest(app);

describe('GET / route', () => {
  it('should successfully get the endpoint', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });
});
