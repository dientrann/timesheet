import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDTO } from './DTO/task.DTO';
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('search')
  async searchTask(@Res() res, @Query('name') name: string) {
    const tasks = await this.taskService.search(name);
    if (!tasks)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    if (tasks.length == 0)
      return res
        .status(HttpStatus.OK)
        .json({ tasks: 'No results found', message: 'Succeed' });
    return res.status(HttpStatus.OK).json({ tasks, message: 'Succeed' });
  }
  @Post('add')
  async createTask(@Res() res, @Body() task: TaskDTO) {
    const newTask = await this.taskService.createTask(task);
    if (!newTask)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Create Task Succeed' });
  }

  @Delete('delete/:id')
  async deleteTask(@Res() res, @Param('id') id: string) {
    const deleteTask = await this.taskService.deleteTask(id);
    if (!deleteTask)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({ message: 'Delete Succeed' });
  }

  @Put(':id/complete')
  async completeTask(@Res() res, @Param('id') id: string) {
    const result = await this.taskService.completeTask(id);
    if (!result)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({ message: 'Complete Succeed' });
  }
}
