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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
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
    async createUser(data) {
        return this.prisma.user.create({
            data,
        });
    }
    async createUserDetails(data) {
        return this.prisma.user_Details.create({
            data,
        });
    }
    async createPassword(data) {
        return this.prisma.password.create({
            data,
        });
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
        const { where, data } = params;
        return this.prisma.password.update({
            data,
            where,
        });
    }
    async deleteUser(where) {
        return this.prisma.user.delete({
            where,
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map