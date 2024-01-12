import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
  ) {}

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return payload;
    } catch (error) {
      throw new Error('Error verifying token');
    }
  }

  async generateJwt(payload) {
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
      }),
    };
  }

  async signIn(user) {
    try {
      if (!user) {
        throw new BadRequestException('Unauthenticated');
      }
      console.log('Hello');
      console.log(user.email);
      const result = this.client.send({ cmd: 'get-user' }, user.email);
      const responseArray = await lastValueFrom(result);
      // result.subscribe()
      //const responseArray = await lastValueFrom<String[]>(result)
      responseArray.forEach((element) => {
        console.log(element);
      });
      if (!responseArray || responseArray.length === 0) {
        return null;
      }

      console.log(process.env.JWT_SECRET_KEY);

      return this.generateJwt({
        sub: responseArray[0],
        email: responseArray[1],
        role: responseArray[2],
      });
    } catch (error) {
      // Handle error during Google authentication callback handling
      throw new Error('Error processing Google authentication callback');
    }
  }
}
