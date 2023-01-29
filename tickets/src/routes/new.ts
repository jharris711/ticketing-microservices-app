import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequests, requireAuth } from '@jheezytix/common';
import { Ticket } from '../models';
import TicketCreatedPublisher from '../events/publishers/ticketCreatedPublisher';
import natsWrapper from '../natsWrapper';

const router = express.Router();

const titleValidator = body(`title`)
  .not()
  .isEmpty()
  .withMessage(`Title is required`);
const priceValidator = body(`price`)
  .isFloat({ gt: 0 })
  .withMessage(`Price must be greater than zero`);

router.post(
  `/api/tickets`,
  requireAuth,
  [titleValidator, priceValidator],
  validateRequests,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
