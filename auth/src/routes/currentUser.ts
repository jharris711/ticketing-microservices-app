import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * Endpoint
 */
const currentUserUrl = `/api/users/currentuser`;

/**
 * Middlewares
 */

/**
 * Handler
 */
const handler = async (req: Request, res: Response) => {
  res.send('Hi there');
};

router.get(currentUserUrl);

export { router as currentUserRouter };
