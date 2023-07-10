import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { ProjectDTO } from './DTO/project.DTO';
import { UserService } from '../User/user.service';
import { TaskService } from '../Task/task.service';
import { InfoProject } from './DTO/infoProject';
import { User } from 'src/schemas/user.schema';
import { ClientService } from '../Client/client.service';
import { Client } from 'src/schemas/client.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly ProjectModel: Model<ProjectDocument>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    private readonly clientService: ClientService,
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
    const { name, describe, status, clientPhone, implementer, task } = project;

    const resultName = await this.checkProjectbyName(name);

    if (!!implementer.leader) {
      const resultLeader = await this.getInfoLeader(implementer.leader);
    }
    if (!!implementer.staff) {
      const resultStaff = await this.checkStaff(implementer.staff);
    }
    if (!!task) {
      const resultTask = await this.getFullNameStaff(implementer.staff);
    }

    const newProject = new this.ProjectModel({
      name: name,
      describe: describe,
      clientPhone: clientPhone,
      status: status || 0,
      implementer: implementer,
      task: task,
    });
    return newProject.save();
  }

  async updateProject(id: string, project: ProjectDTO): Promise<Project> {
    const check = await this.checkProjectbyID(id);

    const { name, describe, status, implementer, task } = project;

    const resultName = await this.checkNameProject(name);

    if (!!implementer.leader) {
      const resultLeader = await this.getInfoLeader(implementer.leader);
    }
    if (!!implementer.staff) {
      const resultStaff = await this.checkStaff(implementer.staff);
    }
    if (!!task) {
      const resultTask = await this.getFullNameStaff(task);
    }
    //Status 1 là dự án bắt đầu. timeStart sẽ cập nhật giá trị Date khi status 1 lần đầu tiên.
    if (status == 1) {
      if (!!project.timeStart) project.timeStart = now();
    }
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

  async getInfoProject(id: string): Promise<InfoProject> {
    const project = await this.checkProjectbyID(id);

    const { name, status, implementer, timeStart, timeEnd, task, clientPhone } =
      project;

    const leader = implementer.leader;

    const userLeader = await this.getInfoLeader(implementer.leader);

    const { fullName, phone } = userLeader;

    const arrayFullName = await this.getFullNameStaff(implementer.staff);

    const client = await this.clientService.getClient(clientPhone);

    const infoProject: InfoProject = {
      nameProject: name,
      status: status,
      clientName: client.name,
      clientPhone: clientPhone,
      leader: implementer.leader,
      leaderName: fullName,
      leaderPhone: phone,
      staff: arrayFullName,
      task: task,
      timeStart: timeStart,
      timeEnd: timeEnd,
    };
    return infoProject;
  }

  async checkProjectbyID(id: string): Promise<Project> {
    const check = await this.ProjectModel.findById(id);
    if (!check)
      throw new HttpException('Project Not Found', HttpStatus.BAD_REQUEST);
    return check;
  }

  async checkProjectbyName(name: string): Promise<Project> {
    const check = await this.ProjectModel.findOne({ name });
    if (!check)
      throw new HttpException('Project Not Found', HttpStatus.BAD_REQUEST);
    return check;
  }

  async checkNameProject(name: string): Promise<boolean> {
    const check = await this.ProjectModel.findOne({ name });
    if (check)
      throw new HttpException(
        'The Project name already exists',
        HttpStatus.BAD_REQUEST,
      );
    return true;
  }

  async getInfoLeader(username: string): Promise<User> {
    const checkUser = await this.userService.dataUserbyName(username);
    if (!checkUser)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return checkUser;
  }

  async checkStaff(staff: Array<string>): Promise<boolean> {
    for (const item of staff) {
      const checkUser = await this.userService.checkUser(item);
      if (!checkUser)
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return true;
  }

  async checkArrayTask(task: Array<string>): Promise<boolean> {
    for (const item of task) {
      const checkTask = await this.taskService.checkTaskbyName(item);
      if (!checkTask)
        throw new HttpException('Task Not Found', HttpStatus.NOT_FOUND);
    }
    return true;
  }

  async getFullNameStaff(staff: Array<string>): Promise<Array<string>> {
    const fullNameStaff = [];
    for (const item of staff) {
      const user = await this.userService.dataUserbyName(item);
      fullNameStaff.push(user.fullName);
      if (!user)
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return fullNameStaff;
  }

  async getInfoClient(phone: string): Promise<Client> {
    return;
  }
}
