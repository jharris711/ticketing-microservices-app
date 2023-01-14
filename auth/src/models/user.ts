import mongoose from 'mongoose';

/**
 * Describes the propeties that are required to
 * create a new User
 */
interface UserAttrs {
  email: string;
  password: string;
}

/**
 * Describes the properties that a User model has
 */
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Add method to the schema
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<any, UserModel>('User', userSchema);

export default User;
