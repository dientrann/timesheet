import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDTO } from './DTO/client.DTO';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/Authentication/role/roles.guard';

@Controller('client')
@UseGuards(RoleGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async pageListClient(@Res() res, @Query('page') page: number) {
    const pageInt = page || 1;
    const { pageData, maxPage } = await this.clientService.pagelistClient(
      pageInt,
    );
    if (!pageData)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res
      .status(HttpStatus.OK)
      .json({ pageData, message: `Page: ${page} MaxPage: ${maxPage} ` });
  }
  @Post('add')
  async createClient(@Res() res, @Body() client: ClientDTO) {
    const newClient = await this.clientService.createClient(client);
    if (!newClient)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.CREATED).json({ message: 'Create Succeed' });
  }

  @Put('update/:id')
  async updateClient(
    @Res() res,
    @Param('id') id: string,
    @Body() client: ClientDTO,
  ) {
    const editClient = await this.clientService.updateClient(id, client);
    if (!editClient)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({ message: 'Update Succeed' });
  }
}
