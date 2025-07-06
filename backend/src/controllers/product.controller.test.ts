import {
  create,
  getAll,
  getById,
  remove,
  update,
} from '../controllers/product.controller';
import * as service from '../services/product.service';
import { ProductErrors } from '../types/product';
import { NextFunction, Request, Response } from 'express';

jest.mock('../services/product.service');
const mockedService = service as jest.Mocked<typeof service>;

const createMockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res as Response);
  res.json = jest.fn().mockReturnValue(res as Response);
  res.send = jest.fn().mockReturnValue(res as Response);
  return res as Response;
};

const createMockRequest = (data: Partial<Request>): Request => data as Request;

describe('Product Controller', () => {
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    next = jest.fn();
  });

  describe('getAll', () => {
    it('should return paginated products with meta including imageUrl and description', async () => {
      const req = createMockRequest({ query: { limit: '2', page: '1' } });
      const res = createMockResponse();

      mockedService.getAllWithCount.mockResolvedValue({
        total: 3,
        products: [
          {
            id: 1,
            name: 'P1',
            quantity: 1,
            unitPrice: 10,
            imageUrl: 'https://example.com/p1.png',
            description: 'Product 1 desc',
          },
        ],
      });

      await getAll(req, res, next);

      expect(mockedService.getAllWithCount).toHaveBeenCalledWith(2, 0);
      expect(res.json).toHaveBeenCalledWith({
        data: [
          {
            id: 1,
            name: 'P1',
            quantity: 1,
            unitPrice: 10,
            imageUrl: 'https://example.com/p1.png',
            description: 'Product 1 desc',
          },
        ],
        meta: { total: 3, page: 1, totalPages: 2 },
      });
    });
  });

  describe('getById', () => {
    it('should return product if found with imageUrl and description', async () => {
      const req = createMockRequest({ params: { id: '1' } });
      const res = createMockResponse();

      mockedService.getById.mockResolvedValue({
        id: 1,
        name: 'P1',
        quantity: 1,
        unitPrice: 10,
        imageUrl: 'https://example.com/p1.png',
        description: 'Product 1 desc',
      });

      await getById(req, res, next);

      expect(mockedService.getById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'P1',
        quantity: 1,
        unitPrice: 10,
        imageUrl: 'https://example.com/p1.png',
        description: 'Product 1 desc',
      });
    });

    it('should return 404 if product not found', async () => {
      const req = createMockRequest({ params: { id: '2' } });
      const res = createMockResponse();

      mockedService.getById.mockResolvedValue(null);

      await getById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: ProductErrors.NOT_FOUND });
    });
  });

  describe('create', () => {
    it('should create product with valid data including imageUrl and description', async () => {
      const req = createMockRequest({
        body: {
          name: 'P1',
          quantity: 5,
          unitPrice: 50,
          imageUrl: 'https://example.com/p1.png',
          description: 'Product 1 desc',
        },
      });
      const res = createMockResponse();

      mockedService.create.mockResolvedValue({ id: 1, ...req.body });

      await create(req, res, next);

      expect(mockedService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    it('should return 400 for invalid data', async () => {
      const req = createMockRequest({
        body: { name: '', quantity: -5, unitPrice: -1 },
      });
      const res = createMockResponse();

      await create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(mockedService.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update product with valid data including imageUrl and description', async () => {
      const req = createMockRequest({
        params: { id: '1' },
        body: {
          quantity: 20,
          imageUrl: 'https://example.com/p1-new.png',
          description: 'Updated desc',
        },
      });
      const res = createMockResponse();

      mockedService.update.mockResolvedValue({
        id: 1,
        name: 'P1',
        quantity: 20,
        unitPrice: 50,
        imageUrl: 'https://example.com/p1-new.png',
        description: 'Updated desc',
      });

      await update(req, res, next);

      expect(mockedService.update).toHaveBeenCalledWith(1, req.body);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'P1',
        quantity: 20,
        unitPrice: 50,
        imageUrl: 'https://example.com/p1-new.png',
        description: 'Updated desc',
      });
    });

    it('should return 400 for invalid data', async () => {
      const req = createMockRequest({
        params: { id: '1' },
        body: { quantity: -10 },
      });
      const res = createMockResponse();

      await update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(mockedService.update).not.toHaveBeenCalled();
    });

    it('should handle update errors gracefully', async () => {
      const req = createMockRequest({
        params: { id: '1' },
        body: { quantity: 10 },
      });
      const res = createMockResponse();
      const next = jest.fn((err) => {
        res.status(500).json({ error: ProductErrors.UNKNOWN });
      });

      mockedService.update.mockRejectedValue(new Error('DB error'));

      await update(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ProductErrors.UNKNOWN });
    });
  });

  describe('remove', () => {
    it('should delete product successfully', async () => {
      const req = createMockRequest({ params: { id: '1' } });
      const res = createMockResponse();

      mockedService.remove.mockResolvedValue({
        id: 1,
        name: 'P1',
        quantity: 5,
        unitPrice: 50,
        imageUrl: 'https://example.com/p1.png',
        description: 'Product 1 desc',
      });

      await remove(req, res, next);

      expect(mockedService.remove).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle delete errors gracefully', async () => {
      const req = createMockRequest({ params: { id: '1' } });
      const res = createMockResponse();

      mockedService.remove.mockRejectedValue(new Error('DB error'));
      const next = jest.fn((err) => {
        res.status(500).json({ error: ProductErrors.UNKNOWN });
      });

      await remove(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ProductErrors.UNKNOWN });
    });
  });
});
