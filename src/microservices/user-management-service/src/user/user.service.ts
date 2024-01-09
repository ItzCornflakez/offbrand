import { Injectable } from '@nestjs/common';
import { User, User_Details, Prisma, Password } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async createUserDetails(data: Prisma.User_DetailsCreateInput): Promise<User_Details> {
    return this.prisma.user_Details.create({
      data,
    });
  }

  async createPassword(data: Prisma.PasswordCreateInput): Promise<Password> {
    return this.prisma.password.create({
      data,
    });
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
    data: Prisma.User_DetailsUpdateInput;
  }): Promise<User_Details> {
    const { where, data } = params;
    return this.prisma.user_Details.update({
      data,
      where,
    });
  }

  async updatePassword(params: {
    where: Prisma.PasswordWhereUniqueInput;
    data: Prisma.PasswordUpdateInput;
  }): Promise<Password> {
    const { where, data } = params;
    return this.prisma.password.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
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
