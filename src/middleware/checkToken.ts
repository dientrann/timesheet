import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/modules/Auth/auth.service';

@Injectable()
export class CheckToken implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}
  async use(req: Request | any, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token)
      throw new HttpException(
        'Unauthorized. No Token',
        HttpStatus.UNAUTHORIZED,
      );

    const { username } = await this.jwtService.verify(token);
    const user = await this.authService.validateUser(username);
    req.user = user;
    next();
  }
}
