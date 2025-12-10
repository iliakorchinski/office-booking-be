import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBooking(
    @Req() req,
    @Body() body: { deskId: number; date: string },
  ) {
    const userId = req.user.id;
    const date = new Date(body.date);
    return this.bookingService.createBooking(userId, body.deskId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyBookings(@Req() req) {
    const userId = req.user.id;
    return this.bookingService.getUserBookings(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBooking(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.bookingService.deleteBooking(userId, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateBooking(
    @Req() req,
    @Param('id') id: string,
    @Body() body: { deskId: number; date: string },
  ) {
    const userId: number = req.user.id;

    return this.bookingService.updateBooking(
      userId,
      Number(id),
      Number(body.deskId),
      new Date(body.date),
    );
  }
}
