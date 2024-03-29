import { ArgumentsHost, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private logger;
    constructor(logger: Logger);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
