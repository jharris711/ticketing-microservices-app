import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

/**
 * Augment the Request interface to add the
 * currentUser property to the Request object
 */
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (err) {
    console.error(err);
  }

  next();
};

export default currentUser;
