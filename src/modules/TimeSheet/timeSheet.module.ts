import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TimeSheetController } from './timeSheet.controller';
import { TimeSheetService } from './timeSheet.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeSheet, TimeSheetSchema } from 'src/schemas/timesheet.schema';
import { ProjectService } from '../Project/project.service';
import { Project, ProjectSchema } from 'src/schemas/project.schema';
import { TaskService } from '../Task/task.service';
import { Task, TaskSchema } from 'src/schemas/task.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserService } from '../User/user.service';
import { checkAdmin } from 'src/middleware/checkAdmin';
import { checkToken } from 'src/middleware/checkToken';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], envFilePath: '.env' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.KeyToken'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: TimeSheet.name, schema: TimeSheetSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TimeSheetController],
  providers: [
    TimeSheetService,
    ProjectService,
    TaskService,
    UserService,
    checkToken,
  ],
})
export class TimeSheetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(checkToken).forRoutes('*');
  }
}
