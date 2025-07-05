import request from 'supertest';
import app from '../app';
import prisma from '../../prisma/client';

beforeAll(async () => {
  await prisma.product.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /products', () => {
  it('should return empty array initially', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
