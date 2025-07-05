import {z} from 'zod';

export const productSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  unitPrice: z.number().nonnegative()
});

export const productUpdateSchema = productSchema.partial(); // All optional for PATCH
