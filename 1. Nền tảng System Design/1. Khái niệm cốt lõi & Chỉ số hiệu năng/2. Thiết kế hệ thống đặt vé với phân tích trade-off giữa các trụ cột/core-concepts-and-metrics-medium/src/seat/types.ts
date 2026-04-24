export type SeatStatus = 'AVAILABLE' | 'BOOKED';

export interface Seat {
  id: string;
  status: SeatStatus;
  bookedBy?: string;
  bookedAt?: string; // ISO
}

