import { User, User_Details, Prisma, Password } from '@prisma/client';
import { PrismaService } from './prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null>;
    user_details(userDetailsWhereUniqueInput: Prisma.User_DetailsWhereUniqueInput): Promise<User_Details | null>;
    password(passwordWhereUniqueInput: Prisma.PasswordWhereUniqueInput): Promise<Password | null>;
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
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    createUserDetails(data: Prisma.User_DetailsCreateInput): Promise<User_Details>;
    createPassword(data: Prisma.PasswordCreateInput): Promise<Password>;
    updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User>;
    updateUserDetails(params: {
        where: Prisma.User_DetailsWhereUniqueInput;
        data: Prisma.User_DetailsUpdateInput;
    }): Promise<User_Details>;
    updatePassword(params: {
        where: Prisma.PasswordWhereUniqueInput;
        data: Prisma.PasswordUpdateInput;
    }): Promise<Password>;
    deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User>;
    deleteUserDetails(where: Prisma.User_DetailsWhereUniqueInput): Promise<User_Details>;
    deletePassword(where: Prisma.PasswordWhereUniqueInput): Promise<Password>;
}
