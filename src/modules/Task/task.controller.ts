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
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { FilterQuery, TaskDTO } from './DTO/task.DTO';
import { AdminGuard } from 'src/modules/Auth/Role/roles.guard';
import { IsIn, IsInt, IsNumber, IsOptional } from 'class-validator';

@Controller('tasks')
@UseGuards(AdminGuard)
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
    return res
      .status(HttpStatus.OK)
      .json({ id: id, message: 'Complete Succeed' });
  }

  @Get('filter')
  async getUncompleteTask(
    @Res() res,

    @Query('complete') complete: number,
    @Query('time') time: number,
    //@Query() query: FilterQuery,
  ) {
    
    const dataUncompleteTask = await this.taskService.filterComplete(
      complete,
      time,
    );
    if (!dataUncompleteTask)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    if (dataUncompleteTask.length == 0)
      res
        .status(HttpStatus.OK)
        .json({ Uncomplete: 'No Task', message: 'Succeed' });
    return res
      .status(HttpStatus.OK)
      .json({ dataUncompleteTask, message: 'Succeed' });
  }
  @Put(':id/archive')
  async archiveTask(@Res() res, @Param('id') id: string) {
    const result = await this.taskService.archiveTask(id);
    if (!result)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res
      .status(HttpStatus.OK)
      .json({ id: id, message: 'Archive Succeed' });
  }
}
