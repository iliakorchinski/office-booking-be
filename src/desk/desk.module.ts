import { Module } from '@nestjs/common';
import { DeskService } from './desk.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DeskController } from './desk.controller';

@Module({
  imports: [PrismaModule],
  providers: [DeskService],
  exports: [DeskService],
  controllers: [DeskController],
})
export class DeskModule {}
