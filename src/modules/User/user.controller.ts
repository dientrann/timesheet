import {
  Controller,
  Post,
  Get,
  Put,
  Res,
  Body,
  Query,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from '../Auth/DTO/user.DTO';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async pageListUser(@Res() res, @Query('page') page: number) {
    const intPage = page || 1;
    const pageData = await this.userService.pageListUser(intPage);
    res.status(HttpStatus.OK).json({ pageData, message: 'Page: ' + page });
  }

  @Post('add')
  async createUserbyAdmin(@Res() res, @Body() user: UserDTO) {
    const newUser = await this.userService.createUserByAdmin(user);
    if (!newUser)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.CREATED).json({ message: 'Create Succeed' });
  }

  @Put('update')
  async updateUserbyAdmin(
    @Res() res,
    @Param('id') id: string,
    @Body() user: UserDTO,
  ) {
    const dataUser = await this.userService.updateUser(id, user);
    if (!dataUser)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({ message: 'Create Succeed' });
  }
}
