import { UserService } from './user.service';
import { User as UserModel, User_Details as UserDetailsModel, Password as PasswordModel } from '@prisma/client';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(userData: {
        role: string;
    }): Promise<UserModel>;
    createUserDetails(userDetailsData: {
        user: {
            connect: {
                id: number;
            };
        };
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        address_1: string;
        address_2: string;
        city: string;
        postal_code: string;
    }): Promise<UserDetailsModel>;
    createPassword(passwordData: {
        user: {
            connect: {
                id: number;
            };
        };
        hash: string;
    }): Promise<PasswordModel>;
    updateUser(id: string, userData: {
        role?: string;
    }): Promise<UserModel>;
    updateUserDetails(id: string, userDetailsData: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_number?: string;
        address_1?: string;
        address_2?: string;
        city?: string;
        postal_code?: string;
    }): Promise<UserDetailsModel>;
    updatePassword(id: string, passwordData: {
        password: string;
    }): Promise<PasswordModel>;
    deleteUser(id: string): Promise<void>;
    deleteUserDetails(id: string): Promise<void>;
    deletePassword(id: string): Promise<void>;
    getUser(id: string): Promise<UserModel>;
    getUserDetails(id: string): Promise<UserDetailsModel>;
    getPassword(id: string): Promise<PasswordModel>;
}
