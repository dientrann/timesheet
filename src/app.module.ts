import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/Auth/auth.module';
import { UserModule } from './modules/User/user.module';
import { TaskModule } from './modules/Task/task.module';
import { ClientModule } from './modules/Client/client.module';
import { ProjectModule } from './modules/Project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('app.MongoUri'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TaskModule,
    ClientModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
