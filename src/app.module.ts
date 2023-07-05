import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { checkToken } from './middleware/checkToken';
import { JwtModule } from '@nestjs/jwt';
import { TaskController } from './modules/Task/task.controller';
import { checkAdmin } from './middleware/checkAdmin';
import { ClientController } from './modules/Client/client.controller';
import { UserController } from './modules/User/user.controller';
import { ProjectController } from './modules/Project/project.controller';
import { TimeSheetController } from './modules/TimeSheet/timeSheet.controller';

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
  providers: [AppService, checkToken, checkAdmin],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(checkToken)
      .forRoutes(
        UserController,
        TaskController,
        ClientController,
        ProjectController,
        TimeSheetController,
      );
    consumer
      .apply(checkAdmin)
      .forRoutes(
        UserController,
        TaskController,
        ClientController,
        ProjectController,
      );
  }
}
