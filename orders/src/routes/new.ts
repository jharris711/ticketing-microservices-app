import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequests,
} from '@jheezytix/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order, Ticket } from '../models';
import { OrderStatus } from '@jheezytix/common/build/events/types';
import { OrderCreatedPublisher } from '../events/publishers';
import natsWrapper from '../natsWrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60; // 1 min

const ticketIdValidator = body(`ticketId`)
  .not()
  .isEmpty()
  .custom((input: string) => {
    return mongoose.Types.ObjectId.isValid(input);
  })
  .withMessage(`TicketId must be provided`);

router.post(
  `/api/orders`,
  requireAuth,
  [ticketIdValidator],
  validateRequests,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    /**
     * Find the ticket the user is trying to order in the DB
     */
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    /**
     * Make sure the ticket is not already reserved
     * - Run query to look at all orders
     * - Find an order where the ticket is the ticket
     *   we just found *and* the orders status in
     *   *not* canceled
     * - If we find an order from that means the
     *   ticket *is* reserved
     */
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError(`Ticket is already reserved`);

    /**
     * Calculate an expiration date for this order
     */
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    /**
     * Build the order and save to DB
     */
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    /**
     * Publish an event saying that an order was created
     */
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
