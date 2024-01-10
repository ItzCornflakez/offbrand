import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import {
  User as UserModel,
  User_Details as UserDetailsModel,
  Password as PasswordModel,
} from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import {hashPassword} from '../utils/password.utils'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { PasswordDto, UserDetailsDto, UserDto } from 'src/common/dto';
import { AllUserDto } from 'src/common/dto/allUser.dto';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import { UpdateUserDetailsDto } from 'src/common/dto/updateUserDetails.dto';


@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService) {}

  // CREATE ENDPOINTS

  @Post('createUser')
  async createUser(
    @Body() allUserDto: AllUserDto): Promise<DefaultResponseDto> {
      // Create the user, userDetails and Password tables
      const user = await this.userService.createUser(allUserDto);


      const response: DefaultResponseDto = {
        status: 'Success',
        statusCode: HttpStatus.CREATED,
        statusText: 'User created successfully.',
        data: user,
      };
  
      return response;
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: {
      role?: string;
    },
  ): Promise<DefaultResponseDto> {
    
    const updatedUser = await this.userService.updateUser({
      where: { id: Number(id) },
      data: {
      role: userData.role,
      }
    });
   
    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: `User with ID: ${id} updated successfully.`,
      data: updatedUser,
    };

    return response;
  }

  @Put('user/:id/details')
  async updateUserDetails(
    @Param('id') id: string,
    @Body() updateUserDetailsDto: UpdateUserDetailsDto
  ,
  ): Promise<DefaultResponseDto> {
      const updatedUserDetails = await this.userService.updateUserDetails({where: { id: Number(id) },
        data: {...updateUserDetailsDto}});

     const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: `Userdetails for user with ID: ${id} updated successfully.`,
      data: updatedUserDetails,
    };

    return response;
  }

  @Put('user/:id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() passwordData: {
      password: string;
    },
  ): Promise<DefaultResponseDto> {
    await this.userService.updatePassword({id: Number(id), password: passwordData.password});

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: `The password for user with ID: '${id}' was updated successfully.`,
    };

    return response;
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string): Promise<DefaultResponseDto> {
    await this.userService.deleteUserDetails({ id: Number(id) });

    await this.userService.deletePassword({ id: Number(id) });

    await this.userService.deleteUser({ id: Number(id) });


    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: `The password for user with ID: '${id}' was deleted successfully.`,
    };

    return response;
  }
  @Get('user/:id/details')
  async getUserDetails(@Param('id') id: string): Promise<DefaultResponseDto> {
    const userDetails = await this.userService.user_details({ id: Number(id) });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: `Userdetails for user with ID: ${id} was retrived successfully.`,
      data: userDetails,
    };

    return response;
  }

  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Payload() data: any, @Ctx() context: RmqContext) {
    const email = data;
    try {
      const userDetails = await this.userService.user_details({ email: email });
      if (userDetails) {
        const id = userDetails.id;
        const user = await this.userService.user({ id: Number(id) });
        const role = user.role;

        const responseArray = [{ id: id, role: role, email: email }];
        return responseArray;
      }
    } catch (error) {
      // Handle errors and send an appropriate response
      console.error(error);
      return { error: 'Failed to get user information.' };
    }

  }
}