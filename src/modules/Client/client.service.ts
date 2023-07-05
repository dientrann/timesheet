import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { Client, ClientDocument } from 'src/schemas/client.schema';
import { ClientDTO } from './DTO/client.DTO';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name)
    private readonly ClientModel: Model<ClientDocument>,
    private readonly configService: ConfigService,
  ) {}
  async pagelistClient(page: number) {
    const pageSize = this.configService.get<number>('app.PAGESIZE');
    const pageData = await this.ClientModel.find({})
      .skip(page * pageSize - pageSize)
      .limit(pageSize);
    if (pageData.length == 0)
      throw new HttpException(
        'Exceeded the maximum number of pages',
        HttpStatus.BAD_REQUEST,
      );
    return pageData;
  }

  async createClient(client: ClientDTO): Promise<Client> {
    const newClient = new this.ClientModel(client);
    return newClient.save();
  }
  async updateClient(id: string, client: ClientDTO): Promise<Client> {
    const { name, address } = client;
    const check = await this.ClientModel.findById(id);
    if (!check) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const dataClient: ClientDTO = {
      name: name,
      address: address,
      updatedAt: now(),
    };
    const editClient = await this.ClientModel.findByIdAndUpdate(id, dataClient);
    return editClient;
  }
}
