import {NextFunction, Request, Response, Router} from 'express';

const router = Router();

/* GET home page. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/', (req: Request, res: Response, _next: NextFunction) => {
  res.render('index', { title: 'Express' });
});

export default router;

