import { Controller, Get, Post, UseGuards, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly appService: AppService) {}
  @Get()
  async get(@Res() res) {
    console.log(this.appService.getHello());
  }
}
