import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { PricingService } from '../pricing/pricing.service';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly pricingService: PricingService,
  ) {}

  @Post()
  async createReservation(@Body() createReservationDto) {
    const { roomId, checkInDate, checkOutDate, guests, includeBreakfast } =
      createReservationDto;

    const room = await this.reservationsService.findRoomById(roomId);

    const { totalPrice, breakdown } = this.pricingService.calculatePrice(
      room.roomType,
      new Date(checkInDate),
      new Date(checkOutDate),
      guests,
      includeBreakfast,
    );

    const reservation = await this.reservationsService.createReservation({
      room: {
        connect: { id: roomId }, // Use nested relation
      },
      checkInDate,
      checkOutDate,
      guests,
      includeBreakfast,
      totalPrice,
    });
    

    return { reservation, pricingBreakdown: breakdown };
  }

  @Get(':id')
  async getReservation(@Param('id') id: number) {
    return this.reservationsService.getReservationDetails(id);
  }

  @Delete(':id')
  async cancelReservation(@Param('id') id: number) {
    return this.reservationsService.cancelReservation(id);
  }

  @Get()
  async getAllReservations() {
    return this.reservationsService.getAllReservations();
  }
}
