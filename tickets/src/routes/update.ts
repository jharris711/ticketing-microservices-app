import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequests,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@jheezytix/common';
import { Ticket } from '../models';
import natsWrapper from '../natsWrapper';
import { TicketUpdatedPublisher } from '../events';

const router = express.Router();

const validators = [
  body(`title`).not().isEmpty().withMessage(`Title is required`),
  body(`price`)
    .isFloat({ gt: 0 })
    .withMessage(`Price must be provided and must be greater than 0`),
];

router.put(
  `/api/tickets/:id`,
  requireAuth,
  validators,
  validateRequests,
  async (req: Request, res: Response) => {
    // Check for ticket
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundError();

    // Make sure use owns ticket before applying updates
    const notAuthorized = ticket.userId !== req.currentUser!.id;
    if (notAuthorized) throw new NotAuthorizedError();

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };