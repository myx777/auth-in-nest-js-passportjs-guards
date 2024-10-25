import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SignupDto } from 'src/dto/signup.dto';

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
