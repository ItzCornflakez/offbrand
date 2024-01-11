import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { User, User_Details, Prisma, Password } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { PasswordDto, UserDetailsDto, UserDto } from 'src/common/dto';
import { AllUserDto } from 'src/common/dto/allUser.dto';
import { hashPassword } from 'src/utils/password.utils';
import { throwError } from 'rxjs';
import { UpdateUserDetailsDto } from 'src/common/dto/updateUserDetails.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService ,
  @Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async user_details(
    userDetailsWhereUniqueInput: Prisma.User_DetailsWhereUniqueInput,
  ): Promise<User_Details | null> {
    return this.prisma.user_Details.findUnique({
      where: userDetailsWhereUniqueInput,
    });
  }

  async password(
    passwordWhereUniqueInput: Prisma.PasswordWhereUniqueInput,
  ): Promise<Password | null> {
    return this.prisma.password.findUnique({
      where: passwordWhereUniqueInput,
    });
  }

  async getUserByEmail(
    userEmailWhereUniqueInput: Prisma.User_DetailsWhereUniqueInput,
  ): Promise<User_Details | null> {
    return this.prisma.user_Details.findUnique({
      where: userEmailWhereUniqueInput,
    });
  }

  async getUserDetails(
    userDetailsWhereInput: Prisma.User_DetailsWhereInput,
  ): Promise<User_Details | null> {
    return this.prisma.user_Details.findFirst({
      where: userDetailsWhereInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async users_details(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.User_DetailsWhereUniqueInput;
    where?: Prisma.User_DetailsWhereInput;
    orderBy?: Prisma.User_DetailsOrderByWithRelationInput;
  }): Promise<User_Details[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user_Details.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(allUserDto: AllUserDto ) {

    let userObject: UserDto
    this.prisma.$transaction(async (transactionClient) => {

      userObject = {
        role: allUserDto.role
      };

      userObject.role = String(allUserDto.role);
      const createdUser = await transactionClient.user.create({data: userObject})

      let userDetailsObject: UserDetailsDto = {
        userId: createdUser.id,
        first_name: allUserDto.first_name,
        last_name: allUserDto.last_name,
        email: allUserDto.email,
        phone_number: allUserDto.phone_number,
        address_1: allUserDto.address_1,
        address_2: allUserDto.address_2,
        city: allUserDto.city,
        postal_code: allUserDto.postal_code
      }
      
      const hashedPassword = await hashPassword(allUserDto.password);
      let passwordObject: PasswordDto = {
        userId: createdUser.id,
        hash: hashedPassword
      };
      const createdPassword = await transactionClient.password.create({data: passwordObject})

      try{
        const createdUserDetails = await transactionClient.user_Details.create({data: userDetailsObject})
      } catch (e) {
        throw new ConflictException("Email already exists")      
      }

      console.log('Before create user');
      const result = await this.client.send({ cmd: 'create-user' }, {})
      result.subscribe()
    }
    );

    return userObject

  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async updateUserDetails(params: {
    where: Prisma.User_DetailsWhereUniqueInput;
    data: UpdateUserDetailsDto;
  }): Promise<User_Details> {
    const { where, data } = params;
    return this.prisma.user_Details.update({
      data,
      where,
    });
  }

  async updatePassword(params: {
    id: number;
    password: string;
  }): Promise<void> {
    const hashedPassword = await hashPassword(params.password);
    
    await this.prisma.password.update({where: {id: params.id}, data: {hash: String(hashedPassword)}}); 
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void> {

    const deletedUser = await this.prisma.user.delete({
      where,
    });

    const result = this.client.send({ cmd: 'delete-user' }, { id: deletedUser.id })
    result.subscribe()
  }

  async deleteUserDetails(where: Prisma.User_DetailsWhereUniqueInput): Promise<User_Details> {
    return this.prisma.user_Details.delete({
      where,
    });
  }

  async deletePassword(where: Prisma.PasswordWhereUniqueInput): Promise<Password> {
    return this.prisma.password.delete({
      where,
    });
  }
  
}
