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
exports.validateProductionEnvFile = exports.validateTestEnvFile = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class TestEnvironmentVariables {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TestEnvironmentVariables.prototype, "DATABASE_PORT", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TestEnvironmentVariables.prototype, "APP_PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestEnvironmentVariables.prototype, "DATABASE_CONTAINER_NAME", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestEnvironmentVariables.prototype, "DATABASE_ROOT_PASSWORD", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestEnvironmentVariables.prototype, "DATABASE_NAME", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestEnvironmentVariables.prototype, "DATABASE_USER", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestEnvironmentVariables.prototype, "DATABASE_PASSWORD", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestEnvironmentVariables.prototype, "DATABASE_URL", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestEnvironmentVariables.prototype, "NODE_ENV", void 0);
class ProductionEnvironmentVariables {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductionEnvironmentVariables.prototype, "DATABASE_PORT", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductionEnvironmentVariables.prototype, "APP_PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductionEnvironmentVariables.prototype, "DATABASE_CONTAINER_NAME", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductionEnvironmentVariables.prototype, "APP_CONTAINER_NAME", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductionEnvironmentVariables.prototype, "DATABASE_CONN_RETRY_DELAY", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductionEnvironmentVariables.prototype, "DATABASE_ROOT_PASSWORD", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductionEnvironmentVariables.prototype, "DATABASE_NAME", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductionEnvironmentVariables.prototype, "DATABASE_USER", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductionEnvironmentVariables.prototype, "DATABASE_PASSWORD", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductionEnvironmentVariables.prototype, "DATABASE_URL", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductionEnvironmentVariables.prototype, "NODE_ENV", void 0);
function validateTestEnvFile(config) {
    const validatedTestConfig = (0, class_transformer_1.plainToInstance)(TestEnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = (0, class_validator_1.validateSync)(validatedTestConfig, { skipMissingProperties: false });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedTestConfig;
}
exports.validateTestEnvFile = validateTestEnvFile;
function validateProductionEnvFile(config) {
    const validatedProductionConfig = (0, class_transformer_1.plainToInstance)(ProductionEnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = (0, class_validator_1.validateSync)(validatedProductionConfig, { skipMissingProperties: false });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedProductionConfig;
}
exports.validateProductionEnvFile = validateProductionEnvFile;
//# sourceMappingURL=environment.validation.js.map