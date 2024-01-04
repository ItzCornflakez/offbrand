import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { DefaultErrorResponseDto } from '../dto/defaultErrorResponse.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger){}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errResponse: DefaultErrorResponseDto;
    let httpStatus: number;
    let errDetailmessage: string;
    if(exception instanceof BadRequestException){
      if(Array.isArray(exceptionResponse['message']) ){
        errDetailmessage = exceptionResponse['message'].join(', ');
      }else{
        errDetailmessage = exceptionResponse['message'];
      }

      httpStatus = status
      errResponse = {
        status: 'Error',
        statusCode: httpStatus,
        statusText: errDetailmessage,
      };
    }else {
      httpStatus = status;
      errDetailmessage = exception.message;
      errResponse = {
        status: 'Error',
        statusCode: httpStatus,
        statusText: errDetailmessage,
      };
    }

    //Log the incoming errors
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
}
