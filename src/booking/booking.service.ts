import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: number, deskId: number, date: Date) {
    const existing = await this.prisma.booking.findUnique({
      where: { deskId_date: { deskId, date } },
    });
    if (existing) {
      throw new BadRequestException('Desk is already booked for this date');
    }

    const userExisting = await this.prisma.booking.findFirst({
      where: { userId, date: date },
    });

    if (userExisting) {
      throw new BadRequestException('You already have a booking on this date');
    }

    return this.prisma.booking.create({
      data: { userId, deskId, date },
    });
  }

  getUserBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { desk: true },
      orderBy: { date: 'asc' },
    });
  }
  getAllBookings() {
    return this.prisma.booking.findMany({
      include: { user: true, desk: true },
      orderBy: { date: 'asc' },
    });
  }

  async deleteBooking(userId: number, bookingId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!booking) throw new BadRequestException('Booking not found');
    if (booking.userId !== userId && user?.role !== 'ADMIN')
      throw new BadRequestException('Cannot delete others bookings');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < today && user?.role !== 'ADMIN')
      throw new BadRequestException('Cannot delete past bookings');

    return this.prisma.booking.delete({ where: { id: bookingId } });
  }
}
