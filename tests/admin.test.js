const request = require('supertest');
const express = require('express');
const adminRoutes = require('../routes/admin');

const app = express();
app.use(adminRoutes);

describe('POST add product', () => {
  let server;
  beforeAll(() => {
    server = app.listen(4000);
  });
  afterAll(() => {
    server.close();
  });
  it('should throw 500 error if userId is undefined', async () => {
    const response = await request(app).post('/add-product');
    expect(response.statusCode).toBe(500);
    expect(response.res.statusMessage).toBe('Internal Server Error');
  });
});
