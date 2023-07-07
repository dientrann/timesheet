import {
  Controller,
  Post,
  Res,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserDTO } from '../User/DTO/user.DTO';
import { AuthService } from './auth.service';
import { AccountDTO } from '../User/DTO/account.DTO';
import { UserService } from '../User/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('register')
  async createUser(@Res() res, @Body() user: UserDTO) {
    const newUser = await this.userService.createUser(user);

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
      .cookie('token', token)
      .json({ Token: token, message: 'Login Succeed' });
  }
  @Post('logout')
  async logout(@Res() res) {
    return res
      .clearCookie('token')
      .status(HttpStatus.OK)
      .send({ message: 'Clear Cookie Succeed' });
  }
}
