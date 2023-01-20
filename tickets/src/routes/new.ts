import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequests, requireAuth } from '@jheezytix/common';

const router = express.Router();

router.post(
  `/api/tickets`,
  requireAuth,
  [
    body(`title`).not().isEmpty().withMessage(`Title is required`),
    body(`price`)
      .isFloat({ gt: 0 })
      .withMessage(`Price must be greater than zero`),
  ],
  validateRequests,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { router as createTicketRouter };
