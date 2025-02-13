import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({ username, email, password:hashedPassword, role });
    await user.save();
    return { message: 'User registered successfully' };
  }

  // Login: Verify user role and generate JWT
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    

    if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    
    const isMatch = bcrypt.compare(user.password, password);

    
    if (!isMatch) {
        throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    console.log(isMatch);
    const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET || 'defaultSecretKey', {expiresIn:'1h'});

    return { token, role: user.role, id:user._id };
  }


  async findUserById(userId:string){
    return await this.userModel.findById(userId).select('-password');
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

  async assignPermissions(adminId: string, userId: string, permissions: string[]) {
    const admin = await this.userModel.findById(adminId);
    
    if (!admin || admin.role !== 'admin') {
      throw new HttpException('Only admins can assign permissions.', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.permissions = permissions;
    await user.save();

    return { message: 'Permissions assigned successfully', user };
  }
}
