// tests/integration/product.middleware.test.ts

import request from 'supertest';
import app from '../../src/app';
import * as service from '../../src/services/product.service';
import { ProductErrors } from '../types/product';

describe('Error middleware', () => {
  it('should handle Prisma P2025 error and return 404', async () => {
    const mockError = {
      name: 'PrismaClientKnownRequestError',
      code: 'P2025',
      clientVersion: 'clientVersion_xyz',
    };

    jest.spyOn(service, 'remove').mockRejectedValue(mockError);

    const response = await request(app).delete('/products/123');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'NOT_FOUND' });
  });

  it('should handle unknown errors and return 500', async () => {
    jest.spyOn(service, 'remove').mockRejectedValue(new Error('Oops'));

    const response = await request(app).delete('/products/123');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: ProductErrors.UNKNOWN });
  });
});
