import { UserService } from './user.service';
import { RmqContext } from '@nestjs/microservices';
import { AllUserDto } from 'src/common/dto/allUser.dto';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import { UpdateUserDetailsDto } from 'src/common/dto/updateUserDetails.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(allUserDto: AllUserDto): Promise<DefaultResponseDto>;
    updateUser(id: string, userData: {
        role?: string;
    }): Promise<DefaultResponseDto>;
    updateUserDetails(id: string, updateUserDetailsDto: UpdateUserDetailsDto): Promise<DefaultResponseDto>;
    updatePassword(id: string, passwordData: {
        password: string;
    }): Promise<DefaultResponseDto>;
    deleteUser(id: string): Promise<DefaultResponseDto>;
    getUserDetails(id: string): Promise<DefaultResponseDto>;
    getUser(data: any, context: RmqContext): Promise<{
        id: number;
        role: string;
        email: any;
    }[] | {
        error: string;
    }>;
}
