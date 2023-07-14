import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../../config/configuration';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../User/user.service';
import { JsonWebTokenStrategy } from 'src/modules/Auth/Verification/jwt.strategy';
import { CheckToken } from 'src/middleware/checkToken';
import { UserController } from '../User/user.controller';
import { TaskController } from '../Task/task.controller';
import { ClientController } from '../Client/client.controller';
import { ProjectController } from '../Project/project.controller';
import { TimeSheetController } from '../TimeSheet/timeSheet.controller';
import { LocalStrategy } from './Verification/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], envFilePath: '.env' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('app.KeyToken'),
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JsonWebTokenStrategy, UserService, CheckToken],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckToken)
      .forRoutes(
        UserController,
        TaskController,
        ClientController,
        ProjectController,
        TimeSheetController,
      );
  }
}
