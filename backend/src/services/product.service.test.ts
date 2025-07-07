jest.mock('../../prisma/client');

import prisma from '../../prisma/client';
import * as service from './product.service';

describe('Product Service ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a product with imageUrl and description', async () => {
    const mockResponse = {
      id: 1,
      name: 'Laptop',
      quantity: 5,
      unitPrice: 999.99,
      imageUrl: 'https://example.com/laptop.png',
      description: 'High-end gaming laptop',
    };

    (prisma.product.create as jest.Mock).mockResolvedValue(mockResponse);

    const result = await service.create({
      name: mockResponse.name,
      quantity: mockResponse.quantity,
      unitPrice: mockResponse.unitPrice,
      imageUrl: mockResponse.imageUrl,
      description: mockResponse.description,
    });

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: 'Laptop' }),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should return a product by ID', async () => {
    const mockProduct = {
      id: 1,
      name: 'Mouse',
      quantity: 10,
      unitPrice: 25,
      imageUrl: 'https://example.com/mouse.png',
      description: 'Wireless mouse',
    };

    (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

    const result = await service.getById(1);
    expect(result).toEqual(mockProduct);
    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should update a product', async () => {
    const updated = {
      id: 1,
      name: 'Keyboard',
      quantity: 30,
      unitPrice: 75,
      imageUrl: 'https://example.com/keyboard-new.png',
      description: 'Updated mechanical keyboard',
    };

    (prisma.product.update as jest.Mock).mockResolvedValue(updated);

    const result = await service.update(1, {
      quantity: 30,
      imageUrl: updated.imageUrl,
      description: updated.description,
    });

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.objectContaining({ quantity: 30 }),
    });
    expect(result).toEqual(updated);
  });

  it('should delete a product', async () => {
    (prisma.product.delete as jest.Mock).mockResolvedValue({ id: 1 });

    await expect(service.remove(1)).resolves.toEqual({ id: 1 });
    expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return paginated products with count', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'P1',
        quantity: 1,
        unitPrice: 10,
        imageUrl: '',
        description: '',
      },
      {
        id: 2,
        name: 'P2',
        quantity: 2,
        unitPrice: 20,
        imageUrl: '',
        description: '',
      },
    ];

    (prisma.product.count as jest.Mock).mockResolvedValue(3);
    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    const result = await service.getAllWithCount(2, 0);

    expect(prisma.product.count).toHaveBeenCalled();
    expect(prisma.product.findMany).toHaveBeenCalledWith({ skip: 0, take: 2 });
    expect(result).toEqual({ total: 3, products: mockProducts });
  });
});
