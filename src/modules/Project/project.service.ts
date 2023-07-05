import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { ProjectDTO } from './DTO/project.DTO';
import { UserService } from '../User/user.service';
import { TaskService } from '../Task/task.service';
import { InfoProjectDTO } from './DTO/infoProject.DTO';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly ProjectModel: Model<ProjectDocument>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  async pagelistProject(page: number) {
    const pageSize = await this.configService.get<number>('app.PageSize');
    const pageData = await this.ProjectModel.find({})
      .skip(pageSize * page - pageSize)
      .limit(pageSize);
    if (pageData.length == 0)
      throw new HttpException(
        'Exceeded the maximum number of pages',
        HttpStatus.BAD_REQUEST,
      );
    return pageData;
  }

  async createProject(project: ProjectDTO): Promise<Project> {
    const { name, describe, status, implementer, task } = project;
    const check = await this.ProjectModel.findOne({ name });
    if (check)
      throw new HttpException(
        'The Project name already exists',
        HttpStatus.BAD_REQUEST,
      );
    const newProject = new this.ProjectModel({
      name: name,
      describe: describe,
      status: status || 0,
      implementer: implementer,
      task: task,
    });
    return newProject.save();
  }

  async updateProject(id: string, project: ProjectDTO): Promise<Project> {
    const { name, describe, status, implementer, task } = project;

    //Check leder có trong User Không
    const nameleder = implementer.leader;
    if (!!implementer) {
      const checkUser = await this.userService.checkUser(nameleder);
      if (!checkUser)
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    //Check task có trong Data không
    if (!!task) {
      const checkTask = await this.taskService.checTask(task);
      if (!checkTask)
        throw new HttpException('Task Not Found', HttpStatus.NOT_FOUND);
    }
    //Status 1 là dự án bắt đầu. timeStart sẽ cập nhật giá trị Date khi status 1 đầ tiên.
    if (status == 1) {
      if (!!project.timeStart) project.timeStart = now();
    }
    const check = await this.ProjectModel.findById(id);
    if (!check) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const newData: ProjectDTO = {
      name: name,
      describe: describe,
      status: status,
      implementer: implementer,
      task: task,
      timeStart: project.timeStart,
      updatedAt: now(),
    };
    const editProject = await this.ProjectModel.findByIdAndUpdate(id, newData);
    return editProject;
  }

  async getInfoProject(id: string): Promise<InfoProjectDTO> {
    const Project = await this.ProjectModel.findById(id);
    if (!Project) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const { name, status, implementer, timeStart, timeEnd, task } = Project;
    const leader = Project.implementer.leader;
    const User = await this.userService.dataUserbyName(leader);
    if (!User) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const { fullName, phone } = User;
    const infoProject: InfoProjectDTO = {
      nameProject: name,
      status: status,
      leader: implementer.leader,
      leaderName: fullName,
      leaderPhone: phone,
      task: task,
      timeStart: timeStart,
      timeEnd: timeEnd,
    };
    return infoProject;
  }
}
