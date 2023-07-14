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
    const checkName = await this.getTaskbyName(name);
    if (checkName)
      throw new HttpException('Task already exists', HttpStatus.UNAUTHORIZED);
    const newTask = new this.TaskModel({
      name: name,
      describe: describe,
      complete: false,
    });
    return newTask.save();
  }

  async deleteTask(id: string): Promise<Task> {
    const check = await this.getTaskbyId(id);
    const deleteTask = await this.TaskModel.findByIdAndDelete(id);
    return deleteTask;
  }

  async completeTask(id: string): Promise<boolean> {
    const check = await this.getTaskbyId(id);
    const result = await this.TaskModel.findByIdAndUpdate(
      id,
      {
        complete: 1,
      },
      { new: true },
    );
    if (result.complete == 0) return false;
    return true;
  }

  async filterComplete(complete: number, time: number) {
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

  async archiveTask(id: string): Promise<boolean> {
    const check = await this.getTaskbyId(id);
    if (check.complete == 0)
      throw new HttpException(
        'Cannot archive an incomplete task',
        HttpStatus.BAD_REQUEST,
      );
    const result = await this.TaskModel.findByIdAndUpdate(
      id,
      {
        complete: 2,
      },
      { new: true },
    );
    if (result.complete == 1) return false;
    return true;
  }

  async getTaskbyId(id: string): Promise<Task> {
    const task = await this.TaskModel.findById(id);
    if (!task) throw new HttpException('Task Not Found', HttpStatus.NOT_FOUND);
    return task;
  }

  async getTaskbyName(name: string): Promise<Task> | null {
    const task = await this.TaskModel.findOne({ name });
    if (task) return task;
    return null;
  }
}
