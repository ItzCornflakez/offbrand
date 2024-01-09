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
const password_utils_1 = require("../utils/password.utils");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(requestData) {
        try {
            var userData = requestData.userData;
            var userDetailsData = requestData.userDetailsData;
            var passwordData = requestData.passwordData;
            console.log('Received data:', userData, userDetailsData, passwordData);
            console.log('Received Userdata:', userData);
            console.log('Received UserDetailsData:', userDetailsData);
            console.log('Received passwordData:', passwordData);
            const user = await this.userService.createUser({
                role: userData.role,
            });
            console.log('User Object:', user);
            await this.userService.createUserDetails({
                ...userDetailsData,
                user: { connect: { id: user.id } },
            });
            const hashedPassword = await (0, password_utils_1.hashPassword)(passwordData.hash);
            await this.userService.createPassword({
                user: { connect: { id: user.id } },
                hash: hashedPassword,
            });
        }
        catch (error) {
            console.error(error);
            throw new common_2.HttpException('Internal Server Error', common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUser(id, userData) {
        return this.userService.updateUser({
            where: { id: Number(id) },
            data: {
                role: userData.role,
            }
        });
    }
    async updateUserDetails(id, userDetailsData) {
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
    async updatePassword(id, passwordData) {
        const hashedPassword = await (0, password_utils_1.hashPassword)(passwordData.password);
        return this.userService.updatePassword({
            where: { id: Number(id) },
            data: {
                hash: hashedPassword
            }
        });
    }
    async deleteUser(id) {
        await this.userService.deleteUserDetails({ id: Number(id) });
        await this.userService.deletePassword({ id: Number(id) });
        await this.userService.deleteUser({ id: Number(id) });
    }
    async getUser(id) {
        return this.userService.user({ id: Number(id) });
    }
    async getUserDetails(id) {
        return this.userService.user_details({ id: Number(id) });
    }
    async getPassword(id) {
        return this.userService.password({ id: Number(id) });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('createUser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
    __metadata("design:paramtypes", [String, Object]),
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
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)('user/:id/details'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Get)('user/:id/password'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPassword", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map