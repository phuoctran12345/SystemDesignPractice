import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SeatService } from './seat.service';

type BookSeatBody = {
  bookedBy?: string;
};

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get()
  list() {
    return this.seatService.listSeats();
  }

  @Post('reset')
  reset() {
    return this.seatService.reset();
  }

  // Demo: same endpoint supports both modes via query param.
  // - lock=0 -> UNSAFE mode (race condition)
  // - default -> LOCKED mode (consistency)
  @Post('book/:seatId')
  async book(
    @Param('seatId') seatId: string,
    @Query('lock') lock: string | undefined,
    @Body() body: BookSeatBody,
  ) {
    const bookedBy = body?.bookedBy?.trim() || `user-${Math.random().toString(16).slice(2, 6)}`;
    const reqId = Math.random().toString(16).slice(2, 10);

    const useLock = lock !== '0' && lock !== 'false';
    if (useLock) {
      return await this.seatService.bookSeatWithLock(seatId, bookedBy, reqId);
    }
    return await this.seatService.bookSeatUnsafe(seatId, bookedBy, reqId);
  }
}

