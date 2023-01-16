import express, { Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, RequestValidationError } from '../errors';
import { User } from '../models';

const router = express.Router();

const url = `/api/users/signup`;
const emailValidator = body('email')
  .isEmail()
  .withMessage('Email must be vaild');
const passwordValidator = body('password')
  .isLength({ min: 4, max: 20 })
  .withMessage('Password must be between 4 and 20 characters');
const validators = [emailValidator, passwordValidator];

router.post(url, validators, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

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
    'asdf'
  );

  // Add to req.session object
  req.session = { jwt: userJwt };

  res.status(201).send(user);
});

export { router as signupRouter };
