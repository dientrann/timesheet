import {
  Controller,
  Post,
  Get,
  Res,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserDTO } from './DTO/user.DTO';
import { AuthService } from './auth.service';
import { AccountDTO } from './DTO/account.DTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async createUser(@Res() res, @Body() user: UserDTO) {
    const newUser = await this.authService.createUser(user);
    if (!newUser)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.CREATED).json({ message: 'Create Succeed' });
  }

  @Post('login')
  async login(@Res() res, @Body() user: AccountDTO) {
    const token = await this.authService.login(user);
    if (!token)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res
      .status(HttpStatus.OK)
      .json({ Token: token, message: 'Login Succeed' });
  }
}
