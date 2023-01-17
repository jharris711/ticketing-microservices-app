import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

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
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send(payload);
  } catch (err) {
    res.send({ currentUser: null });
  }
};

router.get(currentUserUrl, handler);

export { router as currentUserRouter };
