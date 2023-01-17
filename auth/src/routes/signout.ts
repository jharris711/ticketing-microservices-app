import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

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
const handler = async (req: Request, res: Response) => {};

router.post(signoutUrl, handler);

export { router as signoutRouter };
