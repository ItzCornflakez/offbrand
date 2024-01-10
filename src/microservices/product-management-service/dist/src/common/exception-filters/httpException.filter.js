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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let errResponse;
        let httpStatus;
        let errDetailmessage;
        if (exception instanceof common_1.BadRequestException) {
            if (Array.isArray(exceptionResponse['message'])) {
                errDetailmessage = exceptionResponse['message'].join(', ');
            }
            else {
                errDetailmessage = exceptionResponse['message'];
            }
            httpStatus = status;
            errResponse = {
                status: 'Error',
                statusCode: httpStatus,
                statusText: errDetailmessage,
            };
        }
        else {
            httpStatus = status;
            errDetailmessage = exception.message;
            errResponse = {
                status: 'Error',
                statusCode: httpStatus,
                statusText: errDetailmessage,
            };
        }
        const errorLog = {
            httpStatus,
            path: ctx.getRequest().url,
            method: ctx.getRequest().method,
            exceptionMessage: errDetailmessage,
            cause: exception.cause ? exception.cause.toString() : undefined,
        };
        this.logger.error(JSON.stringify(errorLog));
        response.status(status).json(errResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    __metadata("design:paramtypes", [typeof (_a = typeof common_1.Logger !== "undefined" && common_1.Logger) === "function" ? _a : Object])
], HttpExceptionFilter);
//# sourceMappingURL=httpException.filter.js.map