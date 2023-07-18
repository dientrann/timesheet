import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const isAdmin = req.user.isAdmin;
    if (!isAdmin)
      throw new HttpException('Not Have Access Admin', HttpStatus.FORBIDDEN);
    return true;
  }
}
export class EmployeeManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const isEmployeeManager = req.user.isEmployeeManager;
    if (!isEmployeeManager)
      throw new HttpException(
        'Not Have Access Employee Manager',
        HttpStatus.FORBIDDEN,
      );
    return true;
  }
}
