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
    },
  ): Promise<UserModel> {
    const user = await this.userService.createUser({
      role: userData.role,
    });

    return user;
  }

  @Post('user/:id/details')
  async createUserDetails(
    @Body() userDetailsData: {
      user: { connect: { id: number } };
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      address_1: string;
      address_2 : string;
      city: string;
      postal_code: string;
    },
  ): Promise<UserDetailsModel> {
    return this.userService.createUserDetails(userDetailsData);
  }

  @Post('user/:id/password')
  async createPassword(
    @Body() passwordData: {
      user: { connect: { id: number } };
      hash: string;
    },
  ): Promise<PasswordModel> {
    const hashedPassword = await hashPassword(passwordData.hash);
    passwordData.hash = hashedPassword
    return this.userService.createPassword(passwordData);
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: {
      role?: string;
    },
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: {
      role: userData.role,
      }
    });
  }

  @Put('user/:id/details')
  async updateUserDetails(
    @Param('id') id: string,
    @Body() userDetailsData: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone_number?: string;
      address_1?: string;
      address_2?: string;
      city?: string;
      postal_code?: string;
    },
  ): Promise<UserDetailsModel> {
    return this.userService.updateUserDetails({
      where: { id: Number(id) },
      data: {
        first_name: userDetailsData.first_name,
        last_name: userDetailsData.last_name,
        email: userDetailsData.email,
        phone_number: userDetailsData.phone_number,
        address_1: userDetailsData.address_1,
        address_2: userDetailsData.address_2,
        city: userDetailsData.city,
        postal_code: userDetailsData.postal_code,
      }
    });
  }

  @Put('user/:id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() passwordData: {
      password: string;
    },
  ): Promise<PasswordModel> {
    const hashedPassword = await hashPassword(passwordData.password);
    return this.userService.updatePassword({
      where: { id: Number(id) },
      data: {
        hash: hashedPassword
      }
    });
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