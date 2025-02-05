import {Schema, Document, Model, model} from 'mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

export const UserSchema = new Schema(
    {
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['superadmin', 'admin', 'user'], required: true },
    },
    { timestamps: true },
);

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};


export interface User extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  comparePassword(password: string): Promise<boolean>;
}




export const UserModel: Model<User> = model<User>('User', UserSchema);