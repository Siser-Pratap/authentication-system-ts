import { Controller, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Signup route
  @Post('signup')
  async signup(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: string,
  ) {
    return this.userService.signup(username, email, password, role);
  }

  // Login route
  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.userService.login(email, password);
  }

  // Add Admin route (Only Super Admin can call this)
  @Post('add-admin/:superAdminId')
  async addAdmin(
    @Param('superAdminId') superAdminId: string,
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.addAdmin(superAdminId, username, email, password);
  }
}
