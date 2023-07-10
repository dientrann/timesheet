import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TimeSheetService } from './timeSheet.service';
import { TimeSheetDTO } from './DTO/timeSheet.DTO';
import { AuthGuard } from '@nestjs/passport';

@Controller('timesheet')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}

  @Get()
  async listTimeSheet(
    @Res() res,
    @Request() req,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const username = req.user.username;
    const list = await this.timeSheetService.listTimeSheetUser(
      username,
      fromDate,
      toDate,
    );
    if (!list)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({ list, message: 'Succeed' });
  }

  @Post('add')
  async createTimeSheet(
    @Res() res,
    @Request() req,
    @Body() timeSheet: TimeSheetDTO,
  ) {
    const userLogin = req.user;

    const newTimeSheet = await this.timeSheetService.createTimeSheet(
      timeSheet,
      userLogin,
    );
    if (!newTimeSheet)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.CREATED).json({ message: 'Create Succeed' });
  }
}
