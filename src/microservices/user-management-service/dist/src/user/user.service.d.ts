import { User, User_Details, Prisma, Password } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from 'src/common/dto';
import { AllUserDto } from 'src/common/dto/allUser.dto';
import { UpdateUserDetailsDto } from 'src/common/dto/updateUserDetails.dto';
export declare class UserService {
    private prisma;
    private readonly client;
    constructor(prisma: PrismaService, client: ClientProxy);
    user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null>;
    user_details(userDetailsWhereUniqueInput: Prisma.User_DetailsWhereUniqueInput): Promise<User_Details | null>;
    password(passwordWhereUniqueInput: Prisma.PasswordWhereUniqueInput): Promise<Password | null>;
    getUserByEmail(userEmailWhereUniqueInput: Prisma.User_DetailsWhereUniqueInput): Promise<User_Details | null>;
    getUserDetails(userDetailsWhereInput: Prisma.User_DetailsWhereInput): Promise<User_Details | null>;
    users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]>;
    users_details(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.User_DetailsWhereUniqueInput;
        where?: Prisma.User_DetailsWhereInput;
        orderBy?: Prisma.User_DetailsOrderByWithRelationInput;
    }): Promise<User_Details[]>;
    createUser(allUserDto: AllUserDto): Promise<UserDto>;
    updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User>;
    updateUserDetails(params: {
        where: Prisma.User_DetailsWhereUniqueInput;
        data: UpdateUserDetailsDto;
    }): Promise<User_Details>;
    updatePassword(params: {
        id: number;
        password: string;
    }): Promise<void>;
    deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void>;
    deleteUserDetails(where: Prisma.User_DetailsWhereUniqueInput): Promise<User_Details>;
    deletePassword(where: Prisma.PasswordWhereUniqueInput): Promise<Password>;
}
