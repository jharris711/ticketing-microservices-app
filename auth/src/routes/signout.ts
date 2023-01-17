import express, { Request, Response } from 'express';

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

/**
 * Signout route
 */
router.post(signoutUrl, handler);

export { router as signoutRouter };
