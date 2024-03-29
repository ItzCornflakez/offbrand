import { Inject, Injectable } from '@nestjs/common';
import { User, User_Details, Prisma, Password } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { PasswordDto, UserDetailsDto, UserDto } from 'src/common/dto';
import { AllUserDto } from 'src/common/dto/allUser.dto';
import { hashPassword } from 'src/utils/password.utils';
import { UpdateUserDetailsDto } from 'src/common/dto/updateUserDetails.dto';
import { AllUserAdminDto } from 'src/common/dto/allUserAdmin.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject('USER_SERVICE')
    private readonly client: ClientProxy,
    @Inject('USER_SERVICE_RMS')
    private readonly rmsClient: ClientProxy,
  ) {}

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

  async createUser(allUserDto: AllUserDto) {
    try {
      await this.prisma.$transaction(async (transactionClient) => {
        const getUserDetails = await transactionClient.user_Details.findUnique({
          where: { email: allUserDto.email },
        });

        if (getUserDetails) {
          throw new Error('Email already exists');
        }

        const user = await transactionClient.user.create({
          data: { role: 'user' },
        });

        //Make the first created user an admin (for demonstration purposes etc...)
        if (user.id === 1) {
          await transactionClient.user.update({
            where: { id: 1 },
            data: { role: 'admin' },
          });
        }

        const userDetailsObject: UserDetailsDto = {
          userId: user.id,
          first_name: allUserDto.first_name,
          last_name: allUserDto.last_name,
          email: allUserDto.email,
          phone_number: allUserDto.phone_number,
          address_1: allUserDto.address_1,
          address_2: allUserDto.address_2,
          city: allUserDto.city,
          postal_code: allUserDto.postal_code,
        };

        const hashedPassword = await hashPassword(allUserDto.password);
        const passwordObject: PasswordDto = {
          userId: user.id,
          hash: hashedPassword,
        };
        await transactionClient.password.create({
          data: passwordObject,
        });

        await transactionClient.user_Details.create({
          data: userDetailsObject,
        });

        const result = await this.client.send({ cmd: 'create-user' }, {});
        await result.subscribe();

        //Send to reviewMicroService
        const rmsResult = await this.rmsClient.send({ cmd: 'create-user' }, {});
        await rmsResult.subscribe();
      });
    } catch (e) {
      throw e;
    }
  }

  async createUserAdmin(allUserAdminDto: AllUserAdminDto) {
    try {
      const userObject: UserDto = {
        role: allUserAdminDto.role,
      };

      await this.prisma.$transaction(async (transactionClient) => {
        const getUserDetails = await transactionClient.user_Details.findUnique({
          where: { email: allUserAdminDto.email },
        });

        if (getUserDetails) {
          throw new Error('Email already exists');
        }

        const createdUser = await transactionClient.user.create({
          data: userObject,
        });

        const userDetailsObject: UserDetailsDto = {
          userId: createdUser.id,
          first_name: allUserAdminDto.first_name,
          last_name: allUserAdminDto.last_name,
          email: allUserAdminDto.email,
          phone_number: allUserAdminDto.phone_number,
          address_1: allUserAdminDto.address_1,
          address_2: allUserAdminDto.address_2,
          city: allUserAdminDto.city,
          postal_code: allUserAdminDto.postal_code,
        };

        const hashedPassword = await hashPassword(allUserAdminDto.password);
        const passwordObject: PasswordDto = {
          userId: createdUser.id,
          hash: hashedPassword,
        };
        await transactionClient.password.create({
          data: passwordObject,
        });

        await transactionClient.user_Details.create({
          data: userDetailsObject,
        });

        const result = await this.client.send({ cmd: 'create-user' }, {});
        await result.subscribe();

        //Send to reviewMicroService
        const rmsResult = await this.rmsClient.send({ cmd: 'create-user' }, {});
        await rmsResult.subscribe();
      });
    } catch (e) {
      console.log('Thrown error', e);
      throw e;
    }
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

    await this.prisma.password.update({
      where: { id: params.id },
      data: { hash: String(hashedPassword) },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void> {
    const deletedUser = await this.prisma.user.delete({
      where,
    });

    const result = this.client.send({ cmd: 'delete-user' }, deletedUser.id);
    result.subscribe();

    const rmsResult = this.rmsClient.send(
      { cmd: 'delete-user' },
      deletedUser.id,
    );
    rmsResult.subscribe();
  }

  async deleteUserDetails(
    where: Prisma.User_DetailsWhereUniqueInput,
  ): Promise<User_Details> {
    return this.prisma.user_Details.delete({
      where,
    });
  }

  async deletePassword(
    where: Prisma.PasswordWhereUniqueInput,
  ): Promise<Password> {
    return this.prisma.password.delete({
      where,
    });
  }
}
