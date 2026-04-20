import { Router } from 'express';
import { CategoryController } from './category.controller';

const router = Router();

router.post('/', CategoryController.create);
router.get('/', CategoryController.findAll);
router.get('/tree', CategoryController.tree);
router.get('/:id', CategoryController.findOne);
router.patch('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

export default router;