import {NextFunction, Request, Response, Router} from 'express';

const router = Router();

/* GET home page. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/products', (req: Request, res: Response, _next: NextFunction) => {
  res.render('products', { title: 'Products' });
});

export default router;

