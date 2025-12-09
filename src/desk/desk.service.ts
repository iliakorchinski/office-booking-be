import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeskService {
  constructor(private prisma: PrismaService) {}

  getAllDesks() {
    return this.prisma.desk.findMany({ include: { bookings: true } });
  }

  getDeskById(id: number) {
    return this.prisma.desk.findUnique({
      where: { id },
      include: { bookings: true },
    });
  }

  createDesk(name: string, location: string) {
    return this.prisma.desk.create({ data: { name, location } });
  }
}
