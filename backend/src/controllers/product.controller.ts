import { RequestHandler } from 'express';
import * as service from '../services/product.service';
import {
  productSchema,
  productUpdateSchema,
} from '../validators/product.validator';
import { ProductErrors } from '../types/product';

export const getAll: RequestHandler = async (req, res, next) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const offset = (page - 1) * limit;
  try {
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
  } catch (e) {
    next(e);
  }
};

export const getById: RequestHandler = async (req, res, next) => {
  const id = +req.params.id;
  try {
    const product = await service.getById(id);
    if (!product) {
      res.status(404).json({ error: ProductErrors.NOT_FOUND });
      return;
    }

    res.json(product);
  } catch (e) {
    next(e);
  }
};

export const create: RequestHandler = async (req, res, next) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.flatten());
    return;
  }
  try {
    const product = await service.create(parsed.data);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  const id = +req.params.id;
  const parsed = productUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.flatten());
    return;
  }
  try {
    const product = await service.update(id, parsed.data);
    res.json(product);
  } catch (e) {
    next(e);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  const id = +req.params.id;
  try {
    await service.remove(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
