import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { TimeSheetService } from './timeSheet.service';
import { TimeSheetDTO } from './DTO/timeSheet.DTO';

@Controller('timesheet')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}

  @Get()
  async listTimeSheet(@Res() res, @Query('username') username: string) {
    const list = await this.timeSheetService.listTimeSheetUser(username);
    if (!list)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({ list, message: 'Succeed' });
  }

  @Post('add')
  async createTimeSheet(@Res() res, @Body() timeSheet: TimeSheetDTO) {
    const newTimeSheet = await this.timeSheetService.createTimeSheet(timeSheet);
    if (!newTimeSheet)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.CREATED).json({ message: 'Create Succeed' });
  }
}
