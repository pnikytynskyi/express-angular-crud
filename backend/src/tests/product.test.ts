import request from 'supertest';
import app from '../app';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

describe('Product API', () => {
  let createdProductId: number;

  const withCreatedProduct = async () => {
    const productData = {
      name: 'Test Product',
      quantity: 5,
      unitPrice: 12.34,
      imageUrl: 'http://example.com/image.png',
      description: 'Test description',
    };

    const res = await request(app).post('/products').send(productData);
    createdProductId = res.body.id;
  };

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /products', () => {
    it('should return a list with meta info', async () => {
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

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        quantity: 5,
        unitPrice: 12.34,
        imageUrl: 'http://example.com/image.png',
        description: 'Test description',
      };

      const res = await request(app).post('/products').send(productData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject(productData);
      expect(res.body).toHaveProperty('id');

      createdProductId = res.body.id;
    });

    it('should return 400 on invalid data', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: '', quantity: -1 });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('fieldErrors');
    });
  });

  describe('GET /products/:id', () => {
    it('should return product by ID', async () => {
      await withCreatedProduct();
      const res = await request(app).get(`/products/${createdProductId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', createdProductId);
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/products/9999999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PATCH /products/:id', () => {
    it('should update existing product', async () => {
      const updatedData = {
        name: 'Updated Product',
        quantity: 10,
        unitPrice: 99.99,
        imageUrl: 'http://example.com/new-image.png',
        description: 'Updated description',
      };

      const res = await request(app)
        .patch(`/products/${createdProductId}`)
        .send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(updatedData);
    });

    it('should return 400 on invalid update data', async () => {
      const res = await request(app)
        .patch(`/products/${createdProductId}`)
        .send({ quantity: -10 });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('fieldErrors');
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete existing product', async () => {
      const res = await request(app).delete(`/products/${createdProductId}`);
      expect(res.statusCode).toBe(204);
    });

    it('should return 404 deleting non-existent product', async () => {
      const res = await request(app).delete(`/products/9999999`);
      expect(res.statusCode).toBe(404);
    });
  });
});
