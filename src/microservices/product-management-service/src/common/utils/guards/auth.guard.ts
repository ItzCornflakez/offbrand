import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  //constructor(private allowedRoles: string[], @Inject('VERIFY_TOKEN_SERVICE') private readonly client?: ClientProxy) {}
  constructor(
    @Inject('VERIFY_TOKEN_SERVICE') private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const result = this.client.send({ cmd: 'verify-token' }, token);
      const payload = await lastValueFrom(result);

      //const userRole: string = payload.role; // Assuming roles are present in the payload

      //const hasPermission = this.allowedRoles.includes(userRole);
      //if (!hasPermission) {
      //    throw new UnauthorizedException("Insufficient permissions");
      //}
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log(type);
    console.log(token);
    return type === 'Bearer' ? token : undefined;
  }
}
