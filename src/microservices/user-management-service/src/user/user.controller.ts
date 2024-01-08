import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import {
  User as UserModel,
  User_Details as UserDetailsModel,
  Password as PasswordModel,
} from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import {hashPassword} from '../utils/password.utils'


@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService) {}

  // CREATE ENDPOINTS

  @Post('createUser')
  async createUser(
    @Body() requestData: {
      userData: { role: string },
      userDetailsData: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        address_1: string;
        address_2: string;
        city: string;
        postal_code: string;
      },
      passwordData: { hash: string },
    },
  ): Promise<void> {
    try {
      var userData = requestData.userData;
      var userDetailsData = requestData.userDetailsData;
      var passwordData = requestData.passwordData;
      console.log('Received data:', userData, userDetailsData, passwordData);
      console.log('Received Userdata:', userData);
      console.log('Received UserDetailsData:', userDetailsData);
      console.log('Received passwordData:', passwordData);
      // Create the user and get the generated id
      const user = await this.userService.createUser({
        role: userData.role,
      });
      console.log('User Object:', user);

      // Create user details using the generated user id
      await this.userService.createUserDetails({
        ...userDetailsData,
        user: { connect: { id: user.id } },
      });

      // Hash the password and create password using the generated user id
      const hashedPassword = await hashPassword(passwordData.hash);
      await this.userService.createPassword({
        user: { connect: { id: user.id } },
        hash: hashedPassword,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
    await this.userService.deleteUserDetails({ id: Number(id) });

    await this.userService.deletePassword({ id: Number(id) });

    await this.userService.deleteUser({ id: Number(id) });

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