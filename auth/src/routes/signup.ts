import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors';
import { User } from '../models';
import { validateRequests } from '../middleware';

const router = express.Router();

/**
 * Endpoint
 */
const createUserUrl = `/api/users/signup`;

/**
 * Middlewares
 */
const emailValidator = body('email')
  .isEmail()
  .withMessage('Email must be vaild');
const passwordValidator = body('password')
  .isLength({ min: 4, max: 20 })
  .withMessage('Password must be between 4 and 20 characters');
const validators = [emailValidator, passwordValidator];

/**
 * Handler
 */
const handler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check for existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError(`Email in use`);
  }

  // Build a new user and save
  const user = User.build({ email, password });
  await user.save();

  // Create the JWT
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  // Add to req.session object
  req.session = { jwt: userJwt };

  res.status(201).send(user);
};

router.post(createUserUrl, validators, validateRequests, handler);

export { router as signupRouter };
