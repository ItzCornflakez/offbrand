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
exports.GetAllDeletedCategoriesQueryParamsDto = exports.GetAllCategoriesQueryParamsDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const cast_helpers_1 = require("../../common/utils/cast.helpers");
const swagger_1 = require("@nestjs/swagger");
class GetAllCategoriesQueryParamsDto {
}
exports.GetAllCategoriesQueryParamsDto = GetAllCategoriesQueryParamsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: true }),
    (0, class_transformer_1.Transform)(({ value }) => (0, cast_helpers_1.toBoolean)(value)),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GetAllCategoriesQueryParamsDto.prototype, "show_deleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetAllCategoriesQueryParamsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 0 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GetAllCategoriesQueryParamsDto.prototype, "limit", void 0);
class GetAllDeletedCategoriesQueryParamsDto {
}
exports.GetAllDeletedCategoriesQueryParamsDto = GetAllDeletedCategoriesQueryParamsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetAllDeletedCategoriesQueryParamsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 0 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GetAllDeletedCategoriesQueryParamsDto.prototype, "limit", void 0);
//# sourceMappingURL=queryParams.dto.js.map