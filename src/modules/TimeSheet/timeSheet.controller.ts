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
  Put,
  Param,
} from '@nestjs/common';
import { TimeSheetService } from './timeSheet.service';
import { TimeSheetDTO } from './DTO/timeSheet.DTO';
import { EmployeeManagerGuard } from '../Auth/Role/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('timesheet')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}

  @Get()
  async listTimeSheetmineUser(
    @Res() res,
    @Request() req,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const { username } = req.user;
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

  @Put('submit')
  async submitTimeSheet(
    @Res() res,
    @Request() req,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const { username } = req.user;
    const timeSheetUser = await this.timeSheetService.listTimeSheetUser(
      username,
      fromDate,
      toDate,
    );

    if (timeSheetUser.length == 0)
      throw new HttpException(
        `No Items Found in the User TimeSheet from Date ${fromDate} to Date ${toDate}`,
        HttpStatus.NOT_FOUND,
      );

    const result = await this.timeSheetService.editTimeSheetWeek(
      username,
      fromDate,
      toDate,
    );
    if (result.modifiedCount == 0)
      return res.status(HttpStatus.OK).json({ message: 'Not Modfied' });
    if (result.acknowledged == false)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({
      result: `Update TimeSheet Number: ${result.modifiedCount}`,
      message: 'Succeed',
    });
  }

  /* ------------------------------------*/
  @Get('manage')
  @UseGuards(EmployeeManagerGuard)
  async pageTimeSheetPending(@Res() res, @Query('page') page: number) {
    const { pageData, maxPage } =
      await this.timeSheetService.getTimeSheetPending(page);

    if (pageData.length == 0)
      return res.status(HttpStatus.OK).json({ message: 'Succeed' });
    return res
      .status(HttpStatus.OK)
      .json({ pageData, message: `Page ${page}. Max Page ${maxPage}` });
  }
  @Get('manage/timesheetproject/:id')
  @UseGuards(EmployeeManagerGuard)
  async getTimeSheetbyProject(@Res() res, @Param('id') id: string) {
    const dataTimeSheet = await this.timeSheetService.getTimeSheetbyProject(id);

    if (!dataTimeSheet) throw new HttpException('Error', HttpStatus.NOT_FOUND);
    return res.status(HttpStatus.OK).json({
      dataTimeSheet,
      message: `Succeed. Item Number: ${dataTimeSheet.length}`,
    });
  }

  @Get('manage/timesheetweek')
  @UseGuards(EmployeeManagerGuard)
  async listTimeSheet(
    @Res() res,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const dataTimeSheet = await this.timeSheetService.listTimeSheetUser(
      null,
      fromDate,
      toDate,
    );
    if (!dataTimeSheet)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({
      dataTimeSheet,
      message: `Succeed. Item Number: ${dataTimeSheet.length}`,
    });
  }

  @Get('manage/timesheetuser/:id')
  @UseGuards(EmployeeManagerGuard)
  async listTimeSheetUser(@Res() res, @Param('id') id: string) {
    const dataTimeSheet = await this.timeSheetService.getTimeSheetUserbyId(id);
    if (!dataTimeSheet)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({
      dataTimeSheet,
      message: `Succeed. Item Number: ${dataTimeSheet.length}`,
    });
  }

  @Put('manage/approve')
  @UseGuards(EmployeeManagerGuard)
  async approveTimeSheet(
    @Res() res,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const timeSheetUser = await this.timeSheetService.listTimeSheetUser(
      null,
      fromDate,
      toDate,
    );

    if (timeSheetUser.length == 0)
      throw new HttpException(
        `No Items Found TimeSheet from Date ${fromDate} to Date ${toDate}`,
        HttpStatus.NOT_FOUND,
      );

    const result = await this.timeSheetService.editTimeSheetWeek(
      null,
      fromDate,
      toDate,
    );
    if (result.modifiedCount == 0)
      return res.status(HttpStatus.OK).json({ message: 'Not Modfied' });
    if (result.acknowledged == false)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({
      result: `Update TimeSheet Number: ${result.modifiedCount}`,
      message: 'Succeed',
    });
  }
}
