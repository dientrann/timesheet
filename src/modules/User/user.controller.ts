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
import { UserService } from './user.service';
import { UserDTO } from '../Auth/DTO/user.DTO';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async pageListUser(@Res() res, @Query('page') page: number) {
    const intPage = page || 1;
    const pageData = await this.userService.pageListUser(intPage);
    res.status(HttpStatus.OK).json({ pageData, message: 'Page: ' + page });
  }

  @Post()
  async createUserbyAdmin(@Res() res, @Body() user: UserDTO) {
    const newUser = await this.userService.createUserByAdmin(user);
    if (!newUser) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return res.status(HttpStatus.OK).json({ message: 'Create Succeed' });
  }
}
