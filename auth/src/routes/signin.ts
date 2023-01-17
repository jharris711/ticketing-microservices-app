import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequests } from '../middleware';

const router = express.Router();

const bodyValidator = body('email')
  .isEmail()
  .withMessage(`Must be a valid email`);
const passwordValidator = body('password')
  .trim()
  .notEmpty()
  .withMessage(`You must apply a password`);
const validators = [bodyValidator, passwordValidator];

const signinUrl = `/api/users/signin`;

router.post(
  signinUrl,
  validators,
  validateRequests,
  (req: Request, res: Response) => {}
);

export { router as signinRouter };
