import {Request, Response} from 'express';
import * as service from '../services/product.service';
import {productSchema, productUpdateSchema} from '../validators/product.validator';
import {ProductErrors} from "../types/product";

export const getAll = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const offset = (page - 1) * limit;

  const { total, products } = await service.getAllWithCount(limit, offset);
  const totalPages = Math.ceil(total / limit);

  res.json({
    data: products,
    meta: {
      total,
      page,
      totalPages,
    },
  });
};

export const getById = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const product = await service.getById(id);
  if (!product) return res.status(404).json({ error: ProductErrors.NOT_FOUND });
  res.json(product);
};

export const create = async (req: Request, res: Response) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const product = await service.create(parsed.data);
  res.status(201).json(product);
};

export const update = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const parsed = productUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  try {
    const product = await service.update(id, parsed.data);
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: ProductErrors.UNKNOWN });
  }
};

export const remove = async (req: Request, res: Response) => {
  const id = +req.params.id;
  try {
    await service.remove(id);
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: ProductErrors.UNKNOWN });
  }
};
