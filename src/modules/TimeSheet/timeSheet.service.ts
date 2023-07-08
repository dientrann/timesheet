import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { TimeSheet, TimeSheetDocument } from 'src/schemas/timesheet.schema';
import { TimeSheetDTO } from './DTO/timeSheet.DTO';
import { ProjectService } from '../Project/project.service';
import { TaskService } from '../Task/task.service';
import { UserService } from '../User/user.service';
import { User } from 'src/schemas/user.schema';
import { ClientService } from '../Client/client.service';

@Injectable()
export class TimeSheetService {
  constructor(
    @InjectModel(TimeSheet.name)
    private readonly timeSheetModel: Model<TimeSheetDocument>,
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly clientService: ClientService,
  ) {}
  async listTimeSheetUser(username: string) {
    const currentTime: Date = now();

    const timeSheet = await this.getTimeSheetUser(username);

    const dateTimeSheet = timeSheet.filter((item) => {
      return (
        item.createdAt.getDate() == currentTime.getDate() &&
        item.createdAt.getMonth() == currentTime.getMonth() &&
        item.createdAt.getFullYear() == currentTime.getFullYear()
      );
    });

    return dateTimeSheet;
  }
  async createTimeSheet(
    timeSheet: TimeSheetDTO,
    userLogin: User,
  ): Promise<TimeSheet> {
    const { project, task, note, workingtime, type } = timeSheet;

    const checkProject = await this.projectService.checkProjectbyName(project);

    const checkTask = await this.taskService.checkTaskbyName(task);

    const newTimeSheet = new this.timeSheetModel({
      project: project,
      task: task,
      note: note,
      workingtime: workingtime,
      type: type,
      user: userLogin.username,
    });
    return newTimeSheet.save();
  }

  async createTimeSheetWeek(userLogin: string) {
    const timeSheet = await this.getTimeSheetUser(userLogin);
    const timesheetWeek = timeSheet.map((item) => {
      return {
        project: item.project,
        task: item.task,
        note: item.task,
        workingtime: item.workingtime,
        type: item.type,
        user: item.user,
        createdAt: item.createdAt.getDay(),
        updatedAt: item.updatedAt.getDay(),
      };
    });
    console.log({ timesheetWeek });
    for (const item of timesheetWeek) {
    }
  }

  async getTimeSheetUser(username: string) {
    const timeSheet = await this.timeSheetModel.find({ user: username });
    if (!timeSheet) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return timeSheet;
  }
}
