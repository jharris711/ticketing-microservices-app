import express, { Request, Response } from 'express';
import { Ticket } from '../models';
import { NotFoundError } from '@jheezytix/common';

const router = express.Router();

// Get a ticket by id
router.get(`/api/tickets/:id`, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) throw new NotFoundError();

  res.send(ticket);
});

export { router as showTicketRouter };
