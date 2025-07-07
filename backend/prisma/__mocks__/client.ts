const mockProduct = {
  create: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn(),
};

const mockPrisma = {
  product: mockProduct,
  $disconnect: jest.fn(),
};

export default mockPrisma;
