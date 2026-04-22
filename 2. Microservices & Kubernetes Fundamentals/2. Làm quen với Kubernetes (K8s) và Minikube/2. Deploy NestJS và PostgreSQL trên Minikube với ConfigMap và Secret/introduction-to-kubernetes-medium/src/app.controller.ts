import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('health/db')
  async healthDb(): Promise<
    | { status: 'connected' }
    | { status: 'disconnected'; error: string }
  > {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'connected' };
    } catch (e: any) {
      return { status: 'disconnected', error: e?.message ?? String(e) };
    }
  }

  @Get('health')
  getHealth(): { status: 'ok'; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}