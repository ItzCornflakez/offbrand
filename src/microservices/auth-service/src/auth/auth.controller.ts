
import {
    Controller,
    Get,
    HttpStatus,
    Request,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { GoogleOauthGuard } from '.././guards/google-oauth.guard';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleAuth(@Request() req) {}
  
    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthCallback(@Request() req) {
      return this.authService.signIn(req.user);
      
    }

    @MessagePattern({cmd: 'verify-token'})
    async verifyToken(@Payload() data: any, @Ctx() context: RmqContext) {
      const token = data

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);

      return this.authService.verifyToken(token)
        
  }
  }
 