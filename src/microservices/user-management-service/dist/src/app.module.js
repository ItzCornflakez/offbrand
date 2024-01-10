"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const environment_validation_1 = require("../config/environment.validation");
const prisma_module_1 = require("./prisma/prisma.module");
let validateFunction;
switch (process.env.NODE_ENV) {
    case 'production':
        validateFunction = environment_validation_1.validateProductionEnvFile;
        break;
    case 'test':
        validateFunction = environment_validation_1.validateTestEnvFile;
        break;
    default:
        throw new Error(`Unsupported or missing NODE_ENV: ${process.env.NODE_ENV}. Please set NODE_ENV to either 'production' or 'test' in the environment file.`);
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: validateFunction,
            }),
            user_module_1.UserModule,
            prisma_module_1.PrismaModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map