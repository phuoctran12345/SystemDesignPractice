import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as os from 'os';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('version')
  getVersion() {
    return { version: '2.0.0', hostname: os.hostname() };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
