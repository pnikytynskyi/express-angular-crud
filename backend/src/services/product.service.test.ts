import * as service from '../services/product.service';
import prisma from '../../prisma/client';

beforeEach(async () => {
  await prisma.product.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Product Service', () => {
  it('should create a product', async () => {
    const data = { name: 'Laptop', quantity: 5, unitPrice: 999.99 };
    const created = await service.create(data);
    expect(created.id).toBeDefined();
    expect(created.name).toBe(data.name);
  });

  it('should get product by id', async () => {
    const data = { name: 'Mouse', quantity: 10, unitPrice: 25 };
    const created = await service.create(data);
    const found = await service.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.name).toBe(data.name);
  });

  it('should update a product', async () => {
    const created = await service.create({ name: 'Keyboard', quantity: 20, unitPrice: 75 });
    const updated = await service.update(created.id, { quantity: 30 });
    expect(updated.quantity).toBe(30);
    expect(updated.name).toBe('Keyboard'); // unchanged
  });

  it('should delete a product', async () => {
    const created = await service.create({ name: 'Monitor', quantity: 10, unitPrice: 200 });
    await service.remove(created.id);
    const found = await service.getById(created.id);
    expect(found).toBeNull();
  });

  it('should get paginated products with count', async () => {
    // Seed multiple products
    const productsData = [
      { name: 'P1', quantity: 1, unitPrice: 10 },
      { name: 'P2', quantity: 2, unitPrice: 20 },
      { name: 'P3', quantity: 3, unitPrice: 30 },
    ];
    for (const p of productsData) {
      await service.create(p);
    }

    const { total, products } = await service.getAllWithCount(2, 0);
    expect(total).toBe(productsData.length);
    expect(products.length).toBe(2);
    expect(products[0].name).toBe('P1');
    expect(products[1].name).toBe('P2');

    const page2 = await service.getAllWithCount(2, 2);
    expect(page2.products.length).toBe(1);
    expect(page2.products[0].name).toBe('P3');
  });
});
