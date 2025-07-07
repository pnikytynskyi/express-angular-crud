import * as service from '../services/product.service';
import prisma from '../../prisma/client';

describe('Product Service', () => {
  const createdProductIds: number[] = [];

  afterAll(async () => {
    // Remove only the products created during this test run
    await prisma.product.deleteMany({
      where: {
        id: { in: createdProductIds },
      },
    });
    createdProductIds.length = 0;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a product with imageUrl and description', async () => {
    const data = {
      name: 'Laptop',
      quantity: 5,
      unitPrice: 999.99,
      imageUrl: 'https://example.com/laptop.png',
      description: 'High-end gaming laptop',
    };
    const created = await service.create(data);
    createdProductIds.push(created.id);

    expect(created.id).toBeDefined();
    expect(created.name).toBe(data.name);
    expect(created.imageUrl).toBe(data.imageUrl);
    expect(created.description).toBe(data.description);
  });

  it('should get product by id with all fields', async () => {
    const data = {
      name: 'Mouse',
      quantity: 10,
      unitPrice: 25,
      imageUrl: 'https://example.com/mouse.png',
      description: 'Wireless mouse',
    };
    const created = await service.create(data);
    createdProductIds.push(created.id);

    const found = await service.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.name).toBe(data.name);
    expect(found?.imageUrl).toBe(data.imageUrl);
    expect(found?.description).toBe(data.description);
  });

  it('should update product partially including imageUrl and description', async () => {
    const created = await service.create({
      name: 'Keyboard',
      quantity: 20,
      unitPrice: 75,
      imageUrl: 'https://example.com/keyboard.png',
      description: 'Mechanical keyboard',
    });
    createdProductIds.push(created.id);

    const updatedData = {
      quantity: 30,
      imageUrl: 'https://example.com/keyboard-new.png',
      description: 'Updated mechanical keyboard',
    };

    const updated = await service.update(created.id, updatedData);
    expect(updated.quantity).toBe(updatedData.quantity);
    expect(updated.imageUrl).toBe(updatedData.imageUrl);
    expect(updated.description).toBe(updatedData.description);
    expect(updated.name).toBe('Keyboard');
  });

  it('should delete a product', async () => {
    const created = await service.create({
      name: 'Monitor',
      quantity: 10,
      unitPrice: 200,
      imageUrl: 'https://example.com/monitor.png',
      description: '4K UHD Monitor',
    });

    // No need to push to cleanup list since it's being deleted
    await service.remove(created.id);

    const found = await service.getById(created.id);
    expect(found).toBeNull();
  });

  it('should get paginated products with count including new fields', async () => {
    const productsData = [
      {
        name: 'P1',
        quantity: 1,
        unitPrice: 10,
        imageUrl: 'https://example.com/p1.png',
        description: 'Product 1 description',
      },
      {
        name: 'P2',
        quantity: 2,
        unitPrice: 20,
        imageUrl: 'https://example.com/p2.png',
        description: 'Product 2 description',
      },
      {
        name: 'P3',
        quantity: 3,
        unitPrice: 30,
        imageUrl: 'https://example.com/p3.png',
        description: 'Product 3 description',
      },
    ];

    for (const p of productsData) {
      const created = await service.create(p);
      createdProductIds.push(created.id);
    }

    const { total, products } = await service.getAllWithCount(2, 0);
    expect(total).toBe(productsData.length);
    expect(products.length).toBe(2);

    expect(products[0].name).toBe('P1');
    expect(products[0].imageUrl).toBe(productsData[0].imageUrl);
    expect(products[0].description).toBe(productsData[0].description);

    expect(products[1].name).toBe('P2');
    expect(products[1].imageUrl).toBe(productsData[1].imageUrl);
    expect(products[1].description).toBe(productsData[1].description);

    const page2 = await service.getAllWithCount(2, 2);
    expect(page2.products.length).toBe(1);
    expect(page2.products[0].name).toBe('P3');
    expect(page2.products[0].imageUrl).toBe(productsData[2].imageUrl);
    expect(page2.products[0].description).toBe(productsData[2].description);
  });
});
