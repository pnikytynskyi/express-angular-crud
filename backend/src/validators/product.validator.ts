import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  unitPrice: z.number().nonnegative(),
  imageUrl: z.string(),
  description: z.string(),
});

export const productUpdateSchema = productSchema.partial();
