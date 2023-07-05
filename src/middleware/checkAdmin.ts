import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class checkAdmin implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token: string = req.cookies.token;
    const user: User = await this.jwtService.verify(token);
    const isAdmin: number = user.role;
    if (isAdmin != 1)
      throw new HttpException('No Admin', HttpStatus.BAD_REQUEST);
    next();
  }
}
