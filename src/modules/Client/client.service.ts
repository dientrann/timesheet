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
    const pageSize = this.configService.get<number>('app.PageSize');
    const totalItem = await this.ClientModel.countDocuments();
    const pageData = await this.ClientModel.find({})
      .skip(page * pageSize - pageSize)
      .limit(pageSize);

    const infoPage = {
      pageData: pageData,
      totalItem: totalItem,
      maxPage: Math.ceil(totalItem / pageSize),
    };
    return infoPage;
  }

  async createClient(client: ClientDTO): Promise<Client> {
    const newClient = new this.ClientModel(client);
    return newClient.save();
  }
  async updateClient(id: string, client: ClientDTO): Promise<Client> {
    const { name, address, phone } = client;
    const check = await this.ClientModel.findById(id);
    if (!check) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const dataClient: ClientDTO = {
      name: name,
      address: address,
      phone: phone,
      updatedAt: now(),
    };
    const editClient = await this.ClientModel.findByIdAndUpdate(id, dataClient);
    return editClient;
  }
  async getClient(phone: string): Promise<Client> {
    const client = await this.ClientModel.findOne({ phone });
    if (!client) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return client;
  }
}
