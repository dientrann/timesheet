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
import { TimeSheetModule } from './modules/TimeSheet/timeSheet.module';
import { JwtModule } from '@nestjs/jwt';
import { checkAdmin } from './middleware/checkAdmin';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.KeyToken'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TaskModule,
    ClientModule,
    ProjectModule,
    TimeSheetModule,
  ],
  controllers: [AppController],
  providers: [AppService, checkAdmin],
})
export class AppModule {}
