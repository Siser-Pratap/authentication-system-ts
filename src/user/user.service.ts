import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  // Signup: Super Admin or User
  async signup(username: string, email: string, password: string, role: string) {
    if (role === 'admin') {
      throw new HttpException(
        'Only Super Admin can create admins.',
        HttpStatus.FORBIDDEN,
      );
    }

    const userExist = await this.userModel.findOne({ email });
    if (userExist) {
      throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
    }

    const user = new this.userModel({ username, email, password, role });
    await user.save();
    return { message: 'User registered successfully' };
  }

  // Login: Verify user role and generate JWT
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET || 'defaultSecretKey', {expiresIn:'1h'});

    return { token, role: user.role };
  }

  // Add Admin (Only Super Admin)
  async addAdmin(superAdminId: string, username: string, email: string, password: string) {
    const superAdmin = await this.userModel.findById(superAdminId);
    if (!superAdmin || superAdmin.role !== 'superadmin') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const adminExist = await this.userModel.findOne({ email });
    if (adminExist) {
      throw new HttpException('Admin already exists.', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new this.userModel({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
    });
    await admin.save();
    return { message: 'Admin added successfully' };
  }
}
