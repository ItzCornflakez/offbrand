import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import {
  User as UserModel,
  User_Details as UserDetailsModel,
  Password as PasswordModel,
} from '@prisma/client';
import {hashPassword} from './utils/password.utils'

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService) {}

  // CREATE ENDPOINTS

  @Post('user')
  async createUser(
    @Body() userData: {
      role: string;
      email: string;
      password: string;
    },
  ): Promise<UserModel> {
    const hashedPassword = await hashPassword(userData.password);
    const user = await this.userService.createUser({
      role: userData.role,
      email: userData.email,
      password: { create: { hash: hashedPassword } },
    });

    return user;
  }

  @Post('user/:id/details')
  async createUserDetails(
    @Param('id') id: string,
    @Body() userDetailsData: {
      first_name: string;
      last_name: string;
      email: String;
      phone_number: String;
      address_1: String;
      address_2 : String;
      city: String;
      postal_code: String;
    },
  ): Promise<UserDetailsModel> {
    return this.userService.createUserDetails(Number(id), userDetailsData);
  }

  @Post('user/:id/password')
  async createPassword(
    @Param('id') id: string,
    @Body() passwordData: {
      password: string;
    },
  ): Promise<PasswordModel> {
    const hashedPassword = await hashPassword(passwordData.password);
    return this.userService.createPassword(Number(id), { hash: hashedPassword });
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: {
      role?: string;
      email?: string;
      password?: string;
    },
  ): Promise<UserModel> {
    return this.userService.updateUser(Number(id), userData);
  }

  @Put('user/:id/details')
  async updateUserDetails(
    @Param('id') id: string,
    @Body() userDetailsData: {
      first_name?: string;
      last_name?: string;
      // Add other details fields here
    },
  ): Promise<UserDetailsModel> {
    return this.userService.updateUserDetails(Number(id), userDetailsData);
  }

  @Put('user/:id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() passwordData: {
      password: string;
    },
  ): Promise<PasswordModel> {
    const hashedPassword = await hashPassword(passwordData.password);
    return this.userService.updatePassword(Number(id), { hash: hashedPassword });
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser({ id: Number(id) });
  }

  @Delete('user/:id/details')
  async deleteUserDetails(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUserDetails({ id: Number(id) });
  }

  @Delete('user/:id/password')
  async deletePassword(@Param('id') id: string): Promise<void> {
    await this.userService.deletePassword({ id: Number(id) });
  }


  @Get('user/:id')
  async getUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.user({ id: Number(id) });
  }

  @Get('user/:id/details')
  async getUserDetails(@Param('id') id: string): Promise<UserDetailsModel> {
    return this.userService.user_details({ id: Number(id) });
  }

  @Get('user/:id/password')
  async getPassword(@Param('id') id: string): Promise<PasswordModel> {
    return this.userService.password({ id: Number(id) });
  }
}