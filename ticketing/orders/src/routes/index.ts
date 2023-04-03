import { requireAuth } from '@iastickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders',requireAuth, async (req: Request, res: Response) => {
  console.log("user-id:", req.currentUser!.id)
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket')
  res.send(orders);
});

export { router as indexOrderRouter };
