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
    const check = await this.TaskModel.findOne({ name });
    if (check)
      throw new HttpException('Task already exists', HttpStatus.UNAUTHORIZED);
    const newTask = new this.TaskModel({
      name: name,
      describe: describe,
      complete: false,
    });
    return newTask.save();
  }

  async deleteTask(id): Promise<Task> {
    const check = await this.TaskModel.findById(id);
    if (!check) throw new HttpException('Task Not Found', HttpStatus.NOT_FOUND);
    const deleteTask = await this.TaskModel.findByIdAndDelete(id);
    return deleteTask;
  }

  async completeTask(id): Promise<boolean> {
    const check = await this.TaskModel.findById(id);
    if (!check) throw new HttpException('Task Not Found', HttpStatus.NOT_FOUND);
    const complete = await this.TaskModel.findByIdAndUpdate(id, {
      complete: true,
    });
    const Task = await this.TaskModel.findById(id);
    const result = Task.complete;
    return result;
  }
  async checTask(name: string): Promise<boolean> {
    const check = await this.TaskModel.findOne({ name });
    if (!check) return false;
    return true;
  }
}
