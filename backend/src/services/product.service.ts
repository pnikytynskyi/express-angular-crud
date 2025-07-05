import {PrismaClient, Product} from '../generated/prisma'

const prisma = new PrismaClient()

export type CreateData = Omit<Product, 'id'>;

export const getAllWithCount = async (limit = 10, offset = 0) => {
  const [total, products] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({
      skip: offset,
      take: limit,
    }),
  ]);

  return { total, products };
};

export const getById = (id: number) => prisma.product.findUnique({ where: { id } });

export const create = (data: CreateData) => prisma.product.create({ data });

export const update = (id: number, data: Partial<CreateData>) =>
  prisma.product.update({ where: { id }, data });

export const remove = (id: number) =>
  prisma.product.delete({ where: { id } });
