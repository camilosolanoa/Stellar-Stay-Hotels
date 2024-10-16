import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAvailableRooms(
    checkInDate: Date,
    checkOutDate: Date,
    guests: number,
    roomTypeName?: string,
  ) {
    const rooms = await this.prisma.room.findMany({
      where: {
        roomType: {
          maxOccupancy: {
            gte: parseInt(guests.toString(), 10)
          },
          name: roomTypeName ? roomTypeName : undefined,
        },
        reservations: {
          none: {
            OR: [
              {
                checkInDate: {
                  lt: checkOutDate,
                  gte: checkInDate,
                },
              },
              {
                checkOutDate: {
                  gt: checkInDate,
                  lte: checkOutDate,
                },
              },
            ],
          },
        },
      },
      include: {
        roomType: true,
      },
    });

    return rooms;
  }
}
