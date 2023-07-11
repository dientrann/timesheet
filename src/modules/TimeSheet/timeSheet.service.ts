import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { TimeSheet, TimeSheetDocument } from 'src/schemas/timesheet.schema';
import { TimeSheetDTO } from './DTO/timeSheet.DTO';
import { ProjectService } from '../Project/project.service';
import { TaskService } from '../Task/task.service';
import { UserService } from '../User/user.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class TimeSheetService {
  constructor(
    @InjectModel(TimeSheet.name)
    private readonly timeSheetModel: Model<TimeSheetDocument>,
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}
  async listTimeSheetUser(username: string, fromDate: string, toDate: string) {
    const newtoDate = new Date(toDate);
    newtoDate.setDate(newtoDate.getDate() + 1);

    const dataTimeSheet = await this.timeSheetModel.aggregate([
      {
        $match: {
          user: username,
          createdAt: {
            $gte: new Date(fromDate),
            $lte: newtoDate,
          },
        },
      },
    ]);

    return dataTimeSheet;
  }

  async createTimeSheet(
    timeSheet: TimeSheetDTO,
    userLogin: User,
  ): Promise<TimeSheet> {
    const { project, task, note, workingtime, type } = timeSheet;

    const checkProject = await this.projectService.checkProjectbyName(project);

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

  async submitTimeSheetWeek(username: string) {
    const updateMany = await this.timeSheetModel.updateMany(
      { user: username },
      { $set: { status: 1 } },
    );
    return updateMany.modifiedCount;
  }

  async checkTaskProject(project: string, task: string): Promise<boolean> {
    const taskProject = (await this.projectService.checkProjectbyName(project))
      .task;

    const findTaskProject = taskProject.includes(task);
    if (!findTaskProject)
      throw new HttpException('No Task in the Project', HttpStatus.NOT_FOUND);

    return true;
  }

  async getTimeSheetUser(username: string) {
    const timeSheet = await this.timeSheetModel.find({ user: username });
    if (!timeSheet) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return timeSheet;
  }
}
