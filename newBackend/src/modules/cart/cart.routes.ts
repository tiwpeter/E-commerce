// cart.routes.ts
import { Router } from 'express';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { cartErrorHandler } from './cart.controller';
import { prisma } from '@/config/database'; // ← import จากที่เดียวเหมือน products

const cartService = new CartService(prisma);
const cartController = new CartController(cartService);

const router = Router();

router.get('/',
  /* #swagger.tags = ['Cart'] #swagger.summary = 'Get current user cart' #swagger.security = [{ bearerAuth: [] }] */
  cartController.getCart
);

router.post('/items',
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Add item to cart'
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         productId: "abc123",
         variantId: "var123",
         quantity: 1
       }
     }
  */
  cartController.addItem
);


// ✅ เปลี่ยนจาก patch → put
router.put('/items/:cartItemId',
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = 'Update cart item quantity'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['cartItemId'] = { in: 'path', required: true, type: 'string' }
  */
  cartController.updateItem
);

router.delete('/items/:cartItemId',
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = 'Remove item from cart'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['cartItemId'] = { in: 'path', required: true, type: 'string' }
  */
  cartController.removeItem
);

router.delete('/',
  /* #swagger.tags = ['Cart'] #swagger.summary = 'Clear all items from cart' #swagger.security = [{ bearerAuth: [] }] */
  cartController.clearCart
);

router.use(cartErrorHandler);

export default router;