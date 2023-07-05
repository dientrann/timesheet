import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { TimeSheet, TimeSheetDocument } from 'src/schemas/timesheet.schema';
import { TimeSheetDTO } from './DTO/timeSheet.DTO';
import { ProjectService } from '../Project/project.service';
import { TaskService } from '../Task/task.service';
import { UserService } from '../User/user.service';

@Injectable()
export class TimeSheetService {
  constructor(
    @InjectModel(TimeSheet.name)
    private readonly timeSheetModel: Model<TimeSheetDocument>,
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}
  async listTimeSheetUser(username: string) {
    const currentTime: Date = now();

    const timeSheet = await this.timeSheetModel.find({ user: username });

    if (!timeSheet) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const dateTimeSheet = timeSheet.filter((item) => {
      return (
        item.createdAt.getDate() == currentTime.getDate() &&
        item.createdAt.getMonth() == currentTime.getMonth() &&
        item.createdAt.getFullYear() == currentTime.getFullYear()
      );
    });

    return dateTimeSheet;
  }
  async createTimeSheet(timeSheet: TimeSheetDTO): Promise<TimeSheet> {
    const { project, task, note, workingtime, type, user } = timeSheet;
    const checkProject = await this.projectService.checkProject(project);
    if (!checkProject)
      throw new HttpException('Project Not Found', HttpStatus.NOT_FOUND);
    const checkTask = await this.taskService.checTask(task);
    if (!checkTask)
      throw new HttpException('Task Not Found', HttpStatus.NOT_FOUND);
    const checkUser = await this.userService.checkUser(user);
    if (!checkUser)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    const newTimeSheet = new this.timeSheetModel(timeSheet);
    return newTimeSheet.save();
  }
}
