import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), ConfigModule.forRoot({isGlobal: true, envFilePath: '.development.env'})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
