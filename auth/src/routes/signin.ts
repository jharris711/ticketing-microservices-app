import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequests } from '../middleware';
import { User } from '../models';
import { BadRequestError } from '../errors';
import { Password } from '../services';

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
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError(`Invalid credentials`);
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError(`Invalid credentials`);
    }

    // Create the JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Add to req.session object
    req.session = { jwt: userJwt };

    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };
