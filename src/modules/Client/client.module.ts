import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from 'src/schemas/client.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], envFilePath: '.env' }),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
