import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from 'src/schemas/project.schema';
import { ConfigModule } from '@nestjs/config';
import config from '../../config/configuration';
import { UserService } from '../User/user.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Task, TaskSchema } from 'src/schemas/task.schema';
import { TaskService } from '../Task/task.service';
import { Client, ClientSchema } from 'src/schemas/client.schema';
import { ClientService } from '../Client/client.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], envFilePath: '.env' }),
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, UserService, TaskService, ClientService],
})
export class ProjectModule {}
