import express, { Request, Response } from 'express';
import { currentUser } from '@jheezytix/common';

const router = express.Router();

/**
 * Endpoint
 */
const currentUserUrl = `/api/users/currentuser`;

/**
 * Middlewares
 */
const middlewares = [currentUser];

/**
 * Handler
 */
const handler = async (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};

/**
 * CurrentUser route
 */
router.get(currentUserUrl, ...middlewares, handler);

export { router as currentUserRouter };
