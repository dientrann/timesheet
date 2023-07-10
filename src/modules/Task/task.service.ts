import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { TaskDTO } from './DTO/task.DTO';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly TaskModel: Model<TaskDocument>,
  ) {}

  async search(name: string) {
    const regexName = new RegExp(name);
    const tasks = await this.TaskModel.find({ name: regexName });
    return tasks;
  }

  async createTask(task: TaskDTO): Promise<Task> {
    const { name, describe } = task;
    const checkName = await this.checkNameTask(name);
    const newTask = new this.TaskModel({
      name: name,
      describe: describe,
      complete: false,
    });
    return newTask.save();
  }

  async deleteTask(id: string): Promise<Task> {
    const check = await this.checkTaskbyId(id);
    const deleteTask = await this.TaskModel.findByIdAndDelete(id);
    return deleteTask;
  }

  async completeTask(id: string): Promise<boolean> {
    const check = await this.checkTaskbyId(id);
    const complete = await this.TaskModel.findByIdAndUpdate(id, {
      complete: true,
    });
    const Task = await this.TaskModel.findById(id);
    const result = Task.complete;
    return result;
  }

  async filterComplete(complete: boolean, time: number) {
    const currentDate = new Date();
    const query = {
      complete,
      createdAt: {
        $lte: new Date(currentDate.getTime() - time * 24 * 60 * 60 * 1000),
      },
    };

    const dataTaskUncomplete = await this.TaskModel.find({ ...query });

    // const dataTaskUncomplete = await this.TaskModel.aggregate([
    //   {
    //     $match: {
    //       complete: complete === true,
    //       createdAt: {
    //         $lte: new Date(currentDate.getTime() - time * 24 * 60 * 60 * 1000),
    //       },
    //     },
    //   },
    // ]);
    return dataTaskUncomplete;
  }

  async checkTaskbyId(id: string): Promise<Task> {
    const check = await this.TaskModel.findById(id);
    if (!check) throw new HttpException('Task Not Found', HttpStatus.NOT_FOUND);
    return check;
  }

  async checkNameTask(name: string): Promise<boolean> {
    const check = await this.TaskModel.findOne({ name });
    if (check)
      throw new HttpException('Task already exists', HttpStatus.UNAUTHORIZED);
    return true;
  }
  async checkTaskbyName(name: string): Promise<Task> {
    const check = await this.TaskModel.findOne({ name });
    if (!check) throw new HttpException('Task Not Found', HttpStatus.NOT_FOUND);
    return check;
  }
}
