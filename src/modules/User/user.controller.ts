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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './DTO/user.DTO';
import { AdminGuard } from '../Auth/Role/roles.guard';

@Controller('users')
@UseGuards(AdminGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async pageListUser(
    @Res() res,
    @Query('page') page: number,
    @Query('itemPage') itemPage: number,
  ) {
    const intPage = page || 1;
    const { pageData, maxPage } = await this.userService.pageListUser(
      intPage,
      itemPage,
    );
    if (!pageData)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    res
      .status(HttpStatus.OK)
      .json({ pageData, message: `Page: ${page} MaxPage: ${maxPage} ` });
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

  @Put('update/:id')
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
    return res.status(HttpStatus.OK).json({ message: 'Update Succeed' });
  }
}
