import { productSchema, productUpdateSchema } from './product.validator';

describe('Product Validator', () => {
  describe('productSchema (create)', () => {
    it('should pass with valid data including imageUrl and description', () => {
      const data = {
        name: 'Keyboard',
        quantity: 10,
        unitPrice: 49.99,
        imageUrl: 'https://example.com/image.png',
        description: 'A nice keyboard',
      };
      const result = productSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if imageUrl is not a valid URL', () => {
      const data = {
        name: 'Mouse',
        quantity: 5,
        unitPrice: 20,
        imageUrl: 1234,
      };
      const result = productSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.imageUrl).toContain(
          'Expected string, received number',
        );
      }
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
        expect(result.error.flatten().fieldErrors.name).toContain(
          'String must contain at least 1 character(s)',
        );
      }
    });

    it('should fail if quantity is negative or not integer', () => {
      const dataNegative = { name: 'Mouse', quantity: -5, unitPrice: 20 };
      expect(productSchema.safeParse(dataNegative).success).toBe(false);

      const dataFloat = { name: 'Mouse', quantity: 5.5, unitPrice: 20 };
      expect(productSchema.safeParse(dataFloat).success).toBe(false);
    });

    it('should fail if unitPrice is negative', () => {
      const data = { name: 'Mouse', quantity: 5, unitPrice: -1 };
      expect(productSchema.safeParse(data).success).toBe(false);
    });
  });

  describe('productUpdateSchema (update)', () => {
    it('should pass with partial valid data (quantity)', () => {
      const data = { quantity: 100 };
      const result = productUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should pass with partial valid data (imageUrl)', () => {
      const data = { imageUrl: 'https://example.com/image.png' };
      const result = productUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if imageUrl is invalid in update', () => {
      const data = { imageUrl: 123 };
      expect(productUpdateSchema.safeParse(data).success).toBe(false);
    });

    it('should pass with partial valid data (description)', () => {
      const data = { description: 'Updated description' };
      const result = productUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if partial data is invalid (negative quantity)', () => {
      const data = { quantity: -1 };
      expect(productUpdateSchema.safeParse(data).success).toBe(false);
    });

    it('should pass with empty object (no fields)', () => {
      const data = {};
      expect(productUpdateSchema.safeParse(data).success).toBe(true);
    });
  });
});
