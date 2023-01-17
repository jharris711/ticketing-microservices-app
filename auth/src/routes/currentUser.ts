import express, { Request, Response } from 'express';
import { currentUser, requireAuth } from '../middleware';

const router = express.Router();

/**
 * Endpoint
 */
const currentUserUrl = `/api/users/currentuser`;

/**
 * Middlewares
 */
const middlewares = [currentUser, requireAuth];

/**
 * Handler
 */
const handler = async (req: Request, res: Response) => {
  res.send(req.currentUser);
};

/**
 * CurrentUser route
 */
router.get(currentUserUrl, ...middlewares, handler);

export { router as currentUserRouter };
