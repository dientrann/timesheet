import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDTO } from './DTO/project.DTO';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async pageListProject(@Res() res, @Query('page') page: number) {
    const intPage = page || 1;
    const pageData = await this.projectService.pagelistProject(intPage);
    if (!pageData)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    if (pageData.length == 0)
      return res
        .status(HttpStatus.OK)
        .json({ project: 'Not Data', message: 'Succeed' });
    return res
      .status(HttpStatus.OK)
      .json({ pageData, message: `Page : ${page}` });
  }

  @Post('add')
  async createProject(@Res() res, @Body() project: ProjectDTO) {
    const newProject = await this.projectService.createProject(project);
    if (!newProject)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.CREATED).json({ message: 'Create Succeed' });
  }

  @Put('update/:id')
  async updateProject(
    @Res() res,
    @Param('id') id: string,
    @Body() project: ProjectDTO,
  ) {
    const editProject = await this.projectService.updateProject(id, project);
    if (!editProject)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({ message: 'Update Succeed' });
  }

  @Get(':id/info')
  async infoProject(@Res() res, @Param('id') id: string) {
    const infoProject = await this.projectService.getInfoProject(id);
    if (!infoProject)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return res.status(HttpStatus.OK).json({ infoProject });
  }
}