import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookieSession from 'cookie-session';

const router = express.Router();

/**
 * Endpoint
 */
const signoutUrl = `/api/users/signout`;

/**
 * Middlewares
 */

/**
 * Handler
 */
const handler = async (req: Request, res: Response) => {
  req.session = null;
  res.send({});
};

router.post(signoutUrl, handler);

export { router as signoutRouter };
