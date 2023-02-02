import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequests,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
} from '@jheezytix/common';
import { Order } from '../models';
import { OrderStatus } from '@jheezytix/common/build/events/types';

const router = express.Router();

router.post(
  `/api/payments`,
  requireAuth,
  [body(`token`).not().isEmpty(), body(`orderId`).not().isEmpty()],
  validateRequests,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError(`Cannot pay for a cancelled order`);
  }
);

export { router as createChargeRouter };