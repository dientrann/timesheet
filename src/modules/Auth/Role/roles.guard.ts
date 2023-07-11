import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const isAdmin = req.user.isAdmin;
    if (!isAdmin)
      throw new HttpException('Not Have Access', HttpStatus.FORBIDDEN);
    return true;
  }
}
