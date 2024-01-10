import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from 'src/strategies/google.strategy';

@Module({
  imports: [
    ClientsModule.registerAsync([
    {
      name: 'AUTH_SERVICE',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://user:password@rabbitmq:5672`],
          queue: 'auth-queue',
          queueOptions: {
            durable: false,
          },
        },
      }),
      inject: [ConfigService],
    },
  ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2 days' },
    })
],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}