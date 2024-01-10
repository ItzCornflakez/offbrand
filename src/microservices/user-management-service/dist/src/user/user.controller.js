"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const common_2 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const allUser_dto_1 = require("../common/dto/allUser.dto");
const updateUserDetails_dto_1 = require("../common/dto/updateUserDetails.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(allUserDto) {
        const user = await this.userService.createUser(allUserDto);
        const response = {
            status: 'Success',
            statusCode: common_2.HttpStatus.CREATED,
            statusText: 'User created successfully.',
            data: user,
        };
        return response;
    }
    async updateUser(id, userData) {
        const updatedUser = await this.userService.updateUser({
            where: { id: Number(id) },
            data: {
                role: userData.role,
            }
        });
        const response = {
            status: 'Success',
            statusCode: common_2.HttpStatus.CREATED,
            statusText: `User with ID: ${id} updated successfully.`,
            data: updatedUser,
        };
        return response;
    }
    async updateUserDetails(id, updateUserDetailsDto) {
        const updatedUserDetails = await this.userService.updateUserDetails({ where: { id: Number(id) },
            data: { ...updateUserDetailsDto } });
        const response = {
            status: 'Success',
            statusCode: common_2.HttpStatus.CREATED,
            statusText: `Userdetails for user with ID: ${id} updated successfully.`,
            data: updatedUserDetails,
        };
        return response;
    }
    async updatePassword(id, passwordData) {
        await this.userService.updatePassword({ id: Number(id), password: passwordData.password });
        const response = {
            status: 'Success',
            statusCode: common_2.HttpStatus.CREATED,
            statusText: `The password for user with ID: '${id}' was updated successfully.`,
        };
        return response;
    }
    async deleteUser(id) {
        await this.userService.deleteUserDetails({ id: Number(id) });
        await this.userService.deletePassword({ id: Number(id) });
        await this.userService.deleteUser({ id: Number(id) });
        const response = {
            status: 'Success',
            statusCode: common_2.HttpStatus.CREATED,
            statusText: `The password for user with ID: '${id}' was deleted successfully.`,
        };
        return response;
    }
    async getUserDetails(id) {
        const userDetails = await this.userService.user_details({ id: Number(id) });
        const response = {
            status: 'Success',
            statusCode: common_2.HttpStatus.CREATED,
            statusText: `Userdetails for user with ID: ${id} was retrived successfully.`,
            data: userDetails,
        };
        return response;
    }
    async getUser(data, context) {
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
        }
        catch (error) {
            console.error(error);
            return { error: 'Failed to get user information.' };
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('createUser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [allUser_dto_1.AllUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Put)('user/:id/details'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateUserDetails_dto_1.UpdateUserDetailsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserDetails", null);
__decorate([
    (0, common_1.Put)('user/:id/password'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Delete)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('user/:id/details'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserDetails", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get-user' }),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.RmqContext]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map