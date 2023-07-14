import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult, now } from 'mongoose';
import { TimeSheet, TimeSheetDocument } from 'src/schemas/timesheet.schema';
import { TimeSheetDTO } from './DTO/timeSheet.DTO';
import { ProjectService } from '../Project/project.service';
import { TaskService } from '../Task/task.service';
import { UserService } from '../User/user.service';
import { User } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TimeSheetService {
  constructor(
    @InjectModel(TimeSheet.name)
    private readonly timeSheetModel: Model<TimeSheetDocument>,
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async listTimeSheetUser(username: string, fromDate: string, toDate: string) {
    const newtoDate = new Date(toDate);
    newtoDate.setDate(newtoDate.getDate() + 1);

    const query = {
      createdAt: {
        $gte: new Date(fromDate),
        $lte: newtoDate,
      },
    };

    if (username) {
      query['user'] = username;
    }

    const dataTimeSheet = await this.timeSheetModel.aggregate([
      {
        $match: query,
      },
    ]);

    return dataTimeSheet;
  }

  async createTimeSheet(
    timeSheet: TimeSheetDTO,
    userLogin: User,
  ): Promise<TimeSheet> {
    const { project, task, note, workingtime, type } = timeSheet;

    const checkProjectUser = await this.projectService.checkProjectUser(
      project,
      userLogin.username,
    );

    const checkTask = await this.checkTaskProject(project, task);

    const newTimeSheet = new this.timeSheetModel({
      project: project,
      task: task,
      note: note,
      workingtime: workingtime,
      type: type,
      user: userLogin.username,
      status: 0,
    });
    return newTimeSheet.save();
  }

  async editTimeSheetWeek(
    username: string,
    fromDate: string,
    toDate: string,
  ): Promise<UpdateWriteOpResult> {
    const newtoDate = new Date(toDate);
    newtoDate.setDate(newtoDate.getDate() + 1);
    const filter = {
      createdAt: {
        $gte: new Date(fromDate),
        $lte: newtoDate,
      },
      status: 1,
    };

    let update = { status: 2 };
    if (username) {
      filter['user'] = username;
      filter.status = 0;
      update = { status: 1 };
    }

    const updateMany = await this.timeSheetModel.updateMany(filter, update);

    return updateMany;
  }

  async checkTaskProject(project: string, task: string): Promise<boolean> {
    const taskProject = (await this.projectService.getProjectbyName(project))
      .task;

    const findTaskProject = taskProject.includes(task);
    if (!findTaskProject)
      throw new HttpException('No Task in the Project', HttpStatus.NOT_FOUND);

    return true;
  }

  async getTimeSheetUserbyName(username: string) {
    const checkUser = await this.userService.checkUser(username);
    const timeSheet = await this.timeSheetModel.find({ user: username });
    if (!timeSheet) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return timeSheet;
  }

  async getTimeSheetUserbyId(id: string) {
    const User = await this.userService.checkUserbyId(id);
    const timeSheet = await this.timeSheetModel.find({
      user: User.username,
    });
    if (!timeSheet) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return timeSheet;
  }

  /*-------------------------------------------------------------------------------- */

  async getTimeSheetPending(page: number) {
    const pageSize = this.configService.get<number>('app.PageSize');
    const totalItem = await this.timeSheetModel.countDocuments();
    const pageData = await this.timeSheetModel
      .find({ status: 1 })
      .skip(page * pageSize - pageSize)
      .limit(pageSize);

    const infoPage = {
      pageData: pageData,
      totalItem: totalItem,
      maxPage: Math.ceil(totalItem / pageSize),
    };
    return infoPage;
  }

  async getTimeSheetbyProject(id: string) {
    const checkProject = await this.projectService.getProjectbyID(id);
    const project = checkProject.name;

    const timeSheet = await this.timeSheetModel.find({ project });
    if (!timeSheet) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return timeSheet;
  }
}
