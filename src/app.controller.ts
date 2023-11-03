import { Body, Controller, Get, Post,Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  test(@Body() body:any,@Query() qr:any){
    console.log(body,qr)
    return ;
  }

  @Get()
  test1(@Query() qr:any){
    console.log(qr)
    return ;
  }
}
