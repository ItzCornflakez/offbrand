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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const microservices_1 = require("@nestjs/microservices");
const password_utils_1 = require("../utils/password.utils");
let UserService = class UserService {
    constructor(prisma, client) {
        this.prisma = prisma;
        this.client = client;
    }
    async user(userWhereUniqueInput) {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });
    }
    async user_details(userDetailsWhereUniqueInput) {
        return this.prisma.user_Details.findUnique({
            where: userDetailsWhereUniqueInput,
        });
    }
    async password(passwordWhereUniqueInput) {
        return this.prisma.password.findUnique({
            where: passwordWhereUniqueInput,
        });
    }
    async getUserByEmail(userEmailWhereUniqueInput) {
        return this.prisma.user_Details.findUnique({
            where: userEmailWhereUniqueInput,
        });
    }
    async getUserDetails(userDetailsWhereInput) {
        return this.prisma.user_Details.findFirst({
            where: userDetailsWhereInput,
        });
    }
    async users(params) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }
    async users_details(params) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user_Details.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }
    async createUser(allUserDto) {
        let userObject;
        this.prisma.$transaction(async (transactionClient) => {
            userObject = {
                role: allUserDto.role
            };
            userObject.role = String(allUserDto.role);
            const createdUser = await transactionClient.user.create({ data: userObject });
            let userDetailsObject = {
                userId: createdUser.id,
                first_name: allUserDto.first_name,
                last_name: allUserDto.last_name,
                email: allUserDto.email,
                phone_number: allUserDto.phone_number,
                address_1: allUserDto.address_1,
                address_2: allUserDto.address_2,
                city: allUserDto.city,
                postal_code: allUserDto.postal_code
            };
            const hashedPassword = await (0, password_utils_1.hashPassword)(allUserDto.password);
            let passwordObject = {
                userId: createdUser.id,
                hash: hashedPassword
            };
            const createdPassword = await transactionClient.password.create({ data: passwordObject });
            try {
                const createdUserDetails = await transactionClient.user_Details.create({ data: userDetailsObject });
            }
            catch (e) {
                throw new common_1.ConflictException("Email already exists");
            }
            const result = await this.client.send({ cmd: 'create-user' }, {});
            result.subscribe();
        });
        return userObject;
    }
    async updateUser(params) {
        const { where, data } = params;
        return this.prisma.user.update({
            data,
            where,
        });
    }
    async updateUserDetails(params) {
        const { where, data } = params;
        return this.prisma.user_Details.update({
            data,
            where,
        });
    }
    async updatePassword(params) {
        const hashedPassword = await (0, password_utils_1.hashPassword)(params.password);
        await this.prisma.password.update({ where: { id: params.id }, data: { hash: String(hashedPassword) } });
    }
    async deleteUser(where) {
        const deletedUser = await this.prisma.user.delete({
            where,
        });
        const result = this.client.send({ cmd: 'delete-user' }, { id: deletedUser.id });
        result.subscribe();
    }
    async deleteUserDetails(where) {
        return this.prisma.user_Details.delete({
            where,
        });
    }
    async deletePassword(where) {
        return this.prisma.password.delete({
            where,
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('USER_SERVICE')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        microservices_1.ClientProxy])
], UserService);
//# sourceMappingURL=user.service.js.map