import {productSchema, productUpdateSchema} from './product.validator';

describe('Product Validator', () => {
  describe('productSchema (create)', () => {
    it('should pass with valid data', () => {
      const data = {
        name: 'Keyboard',
        quantity: 10,
        unitPrice: 49.99,
      };
      const result = productSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if name is empty', () => {
      const data = {
        name: '',
        quantity: 10,
        unitPrice: 49.99,
      };
      const result = productSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toContain('String must contain at least 1 character(s)');
      }
    });

    it('should fail if quantity is negative or not integer', () => {
      const data = { name: 'Mouse', quantity: -5, unitPrice: 20 };
      expect(productSchema.safeParse(data).success).toBe(false);

      const dataFloat = { name: 'Mouse', quantity: 5.5, unitPrice: 20 };
      expect(productSchema.safeParse(dataFloat).success).toBe(false);
    });

    it('should fail if unitPrice is negative', () => {
      const data = { name: 'Mouse', quantity: 5, unitPrice: -1 };
      expect(productSchema.safeParse(data).success).toBe(false);
    });
  });

  describe('productUpdateSchema (update)', () => {
    it('should pass with partial valid data', () => {
      const data = { quantity: 100 };
      const result = productUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if partial data is invalid', () => {
      const data = { quantity: -1 };
      expect(productUpdateSchema.safeParse(data).success).toBe(false);
    });

    it('should pass with empty object (no fields)', () => {
      const data = {};
      expect(productUpdateSchema.safeParse(data).success).toBe(true);
    });
  });
});
