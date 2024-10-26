import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SignupDto } from 'src/dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/register')
  async createUser(@Body() body: SignupDto) {
    return body;
  }
}
