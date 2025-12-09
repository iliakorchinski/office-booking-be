import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { DeskModule } from './desk/desk.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, DeskModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
