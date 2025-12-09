import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DeskModule } from '../desk/desk.module';

@Module({
  imports: [PrismaModule, DeskModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
