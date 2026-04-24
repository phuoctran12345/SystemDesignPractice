import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeatModule } from './seat/seat.module';

@Module({
  imports: [SeatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
