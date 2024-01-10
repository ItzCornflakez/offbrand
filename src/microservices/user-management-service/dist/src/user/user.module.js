"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const prisma_service_1 = require("../prisma/prisma.service");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, prisma_service_1.PrismaService],
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'USER_SERVICE',
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [`amqp://user:password@rabbitmq:5672`],
                            queue: 'auth-queue',
                            queueOptions: {
                                durable: false,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ]
    })
], UserModule);
//# sourceMappingURL=user.module.js.map