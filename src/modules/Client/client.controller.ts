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
@UseGuards(AuthGuard('jwt'))
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @UseGuards(RoleGuard)
  async pageListClient(@Res() res, @Query('page') page: number) {
    const pageInt = page || 1;
    const dataPage = await this.clientService.pagelistClient(pageInt);
    if (!dataPage)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res
      .status(HttpStatus.OK)
      .json({ dataPage, message: `Page: ${page}` });
  }
  @Post('add')
  @UseGuards(RoleGuard)
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
  @UseGuards(RoleGuard)
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
