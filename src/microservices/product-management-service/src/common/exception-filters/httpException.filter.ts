import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { DefaultErrorResponseDto } from '../dto/defaultErrorResponse.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errResponse: DefaultErrorResponseDto;
    if (exception instanceof BadRequestException) {
      errResponse = {
        status: 'Error',
        statusCode: status,
        statusText: exception.message,
        errors: exceptionResponse['message'] || null,
      };

      response.status(status).json(errResponse);
    } else {
      errResponse = {
        status: 'Error',
        statusCode: status,
        statusText: exception.message,
      };

      response.status(status).json(errResponse);
    }
  }
}
