import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

let mongo: any;

// Use jest to create a fake nats-wrapper for testing
// Mock natsWrapper found in ../__mocks__
jest.mock(`../natsWrapper`);

process.env.STRIPE_KEY =
  'sk_test_51IijgDAFpWGhpgVPZGbUYQKfNG5PzZE4B7bMldBpAfN17xVBzZ3Zmi9Eue4VH0ZcZGE4EDc5qapGxSXUMMkS1CdE00wMO8ncnk';

beforeAll(async () => {
  process.env.JWT_KEY = 'super-secret-key';
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// Fake sign in (tickets service only)
global.signin = (id?: string) => {
  // Create an id from the mongo type
  // Build JSON web token payload { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: `test@test.com`,
  };
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object ( jwt: MY_JWT )
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // Return a str that is the
  // cookie with the encoded data
  return [`session=${base64}`];
};
