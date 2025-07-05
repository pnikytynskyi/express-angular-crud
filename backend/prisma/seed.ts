import {PrismaClient} from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: 'Laptop', quantity: 10, unitPrice: 999.99 },
    { name: 'Mouse', quantity: 50, unitPrice: 25.5 },
    { name: 'Keyboard', quantity: 30, unitPrice: 75.0 },
    { name: 'Monitor', quantity: 20, unitPrice: 200.0 },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: product,
      });
    } else {
      await prisma.product.create({
        data: product,
      });
    }
  }
  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
