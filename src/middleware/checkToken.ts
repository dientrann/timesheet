import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TimeSheetService } from 'src/modules/TimeSheet/timeSheet.service';

@Injectable()
export class checkToken implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
  ) //private readonly timeSheetService: TimeSheetService,
  {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token)
      throw new HttpException(
        'Unauthorized. No Token',
        HttpStatus.UNAUTHORIZED,
      );
    const user = await this.jwtService.verify(token);
    // this.timeSheetService.abc();
    next();
  }
}
