import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  imports: [],
  providers: [],
})
export class UserModule {}
