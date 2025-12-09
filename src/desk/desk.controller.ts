import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { DeskService } from './desk.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('desk')
export class DeskController {
  constructor(private deskService: DeskService) {}

  @Get()
  getAllDesks() {
    return this.deskService.getAllDesks();
  }

  @Get(':id')
  getDeskById(@Param('id') id: string) {
    return this.deskService.getDeskById(Number(id));
  }

  @Post()
  createDesk(@Body() body: { name: string; location: string }) {
    return this.deskService.createDesk(body.name, body.location);
  }
}
