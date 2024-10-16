import { Controller, Get, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { PricingService } from '../pricing/pricing.service';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly pricingService: PricingService,
  ) {}

  @Get('available')
  async getAvailableRooms(
    @Query('checkInDate') checkInDate: string,
    @Query('checkOutDate') checkOutDate: string,
    @Query('guests') guests: number,
    @Query('includeBreakfast') includeBreakfast?: boolean,
    @Query('roomType') roomTypeName?: string,
  ) {
    const availableRooms = await this.roomsService.findAvailableRooms(
      new Date(checkInDate),
      new Date(checkOutDate),
      guests,
      roomTypeName,
    );

    const roomsWithPricing = await Promise.all(
      availableRooms.map(async (room) => {
        const { totalPrice, breakdown } = this.pricingService.calculatePrice(
          room.roomType,
          new Date(checkInDate),
          new Date(checkOutDate),
          guests,
          includeBreakfast,
        );
        return {
          ...room,
          totalPrice,
          pricingBreakdown: breakdown,
        };
      }),
    );

    return roomsWithPricing;
  }
}
