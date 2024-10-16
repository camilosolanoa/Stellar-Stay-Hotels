import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  // Find a room by ID
  async findRoomById(roomId: number) {
    return this.prisma.room.findUnique({
      where: { id: roomId },
      include: { roomType: true },
    });
  }

  // Create a reservation
  async createReservation(data: Prisma.ReservationCreateInput) {
    // Convert string dates to JavaScript Date objects
    const checkInDate = new Date(data.checkInDate);
    const checkOutDate = new Date(data.checkOutDate);
    
    data.checkInDate = checkInDate;
    data.checkOutDate = checkOutDate;
    return this.prisma.reservation.create({
      data,
    });
  }

  // Get reservation details
  async getReservationDetails(id: number) {
    return this.prisma.reservation.findUnique({
      where: { id : Math.floor(id) },
      include: {
        room: {
          include: { roomType: true },
        },
      },
    });
  }

  // Cancel a reservation
  async cancelReservation(id: number) {
    return this.prisma.reservation.delete({
      where: { id: Math.floor(id) },
    });
  }

  // Get all reservations categorized
  async getAllReservations() {
    const now = new Date();
    const reservations = await this.prisma.reservation.findMany({
      include: {
        room: {
          include: { roomType: true },
        },
      },
    });

    const categorized = {
      past: [],
      ongoing: [],
      future: [],
    };

    for (const reservation of reservations) {
      if (reservation.checkOutDate < now) {
        categorized.past.push(reservation);
      } else if (
        reservation.checkInDate <= now &&
        reservation.checkOutDate >= now
      ) {
        categorized.ongoing.push(reservation);
      } else {
        categorized.future.push(reservation);
      }
    }

    return categorized;
  }
}
