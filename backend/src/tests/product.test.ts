import request from 'supertest';
import app from '../app';

describe('GET /products', () => {
  it('should return empty array initially', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({
      data: expect.any(Array),
      meta: {
        page: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number),
      },
    });
  });
});
