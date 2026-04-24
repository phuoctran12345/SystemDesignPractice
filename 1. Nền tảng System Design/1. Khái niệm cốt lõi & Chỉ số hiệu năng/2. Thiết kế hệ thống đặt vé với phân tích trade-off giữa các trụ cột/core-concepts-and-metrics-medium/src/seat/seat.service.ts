import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Seat } from './types';

type SeatLockKey = string;

@Injectable()
export class SeatService {
  // In-memory store (demo)
  private seats: Seat[] = Array.from({ length: 5 }).map((_, idx) => ({
    id: String(idx + 1),
    status: 'AVAILABLE',
  }));

  // Per-seat mutex implemented as a promise chain
  private lockTails = new Map<SeatLockKey, Promise<void>>();

  listSeats(): Seat[] {
    return this.seats;
  }

  reset(): Seat[] {
    this.seats = this.seats.map((s) => ({
      id: s.id,
      status: 'AVAILABLE',
    }));
    return this.seats;
  }

  async bookSeatUnsafe(seatId: string, bookedBy: string, reqId: string) {
    const seat = this.seats.find((s) => s.id === seatId);
    if (!seat) throw new NotFoundException(`Seat ${seatId} not found`);

    this.log(reqId, `UNSAFE: read seat ${seatId} status=${seat.status}`);
    if (seat.status === 'BOOKED') {
      throw new ConflictException(`Seat ${seatId} already booked`);
    }

    // Artificial delay to widen race window
    await this.sleep(250);

    // Non-atomic update: two concurrent requests can pass the check above
    seat.status = 'BOOKED';
    seat.bookedBy = bookedBy;
    seat.bookedAt = new Date().toISOString();
    this.log(reqId, `UNSAFE: wrote seat ${seatId} BOOKED by=${bookedBy}`);

    return seat;
  }

  async bookSeatWithLock(seatId: string, bookedBy: string, reqId: string) {
    return this.withSeatLock(seatId, async () => {
      const seat = this.seats.find((s) => s.id === seatId);
      if (!seat) throw new NotFoundException(`Seat ${seatId} not found`);

      this.log(reqId, `LOCKED: read seat ${seatId} status=${seat.status}`);
      if (seat.status === 'BOOKED') {
        throw new ConflictException(`Seat ${seatId} already booked`);
      }

      await this.sleep(250);

      seat.status = 'BOOKED';
      seat.bookedBy = bookedBy;
      seat.bookedAt = new Date().toISOString();
      this.log(reqId, `LOCKED: wrote seat ${seatId} BOOKED by=${bookedBy}`);

      return seat;
    });
  }

  private async withSeatLock<T>(key: SeatLockKey, fn: () => Promise<T>): Promise<T> {
    const previousTail = this.lockTails.get(key) ?? Promise.resolve();

    let release!: () => void;
    const myTail = new Promise<void>((resolve) => (release = resolve));
    const newTail = previousTail.then(() => myTail);
    this.lockTails.set(key, newTail);

    await previousTail;
    try {
      return await fn();
    } finally {
      release();
      // Cleanup: if no one chained after us, remove to prevent growth
      if (this.lockTails.get(key) === newTail) {
        this.lockTails.delete(key);
      }
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private log(reqId: string, message: string) {
    // compact log optimized for concurrent demo
    // eslint-disable-next-line no-console
    console.log(`[seat-demo][req=${reqId}] ${message}`);
  }
}

