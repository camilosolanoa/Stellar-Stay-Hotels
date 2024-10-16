import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [RoomsModule, ReservationsModule, PrismaModule],
})
export class AppModule {}
