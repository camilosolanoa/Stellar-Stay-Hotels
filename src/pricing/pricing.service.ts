import { Injectable } from '@nestjs/common';
import { Reservation, RoomType } from '@prisma/client';

@Injectable()
export class PricingService {
  calculatePrice(
    roomType: RoomType,
    checkInDate: Date,
    checkOutDate: Date,
    guests: number,
    includeBreakfast: boolean,
  ): { totalPrice: number; breakdown: any } {
    const oneDay = 24 * 60 * 60 * 1000;
    const days = Math.round(
      (checkOutDate.getTime() - checkInDate.getTime()) / oneDay,
    );

    let baseRate = roomType.baseRate;
    const breakdown = {
      baseRate: baseRate,
      weekendSurcharge: 0,
      rentalDaysDiscount: 0,
      breakfastCharge: 0,
    };

    // 1. Weekend Pricing
    let totalBasePrice = 0;
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(checkInDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dayOfWeek = currentDate.getDay();
      let dailyRate = baseRate;

      if (dayOfWeek === 6 || dayOfWeek === 0) {
        // Saturday or Sunday
        dailyRate *= 1.25;
        breakdown.weekendSurcharge += dailyRate - baseRate;
      }

      totalBasePrice += dailyRate;
    }

    // 2. Rental Days Adjustment
    if (days >= 4 && days <= 6) {
      breakdown.rentalDaysDiscount = -4 * days;
    } else if (days >= 7 && days <= 9) {
      breakdown.rentalDaysDiscount = -8 * days;
    } else if (days >= 10) {
      breakdown.rentalDaysDiscount = -12 * days;
    }

    // 3. Breakfast Option
    if (includeBreakfast) {
      breakdown.breakfastCharge = 5 * days * guests;
    }

    const totalPrice =
      totalBasePrice +
      breakdown.rentalDaysDiscount +
      breakdown.breakfastCharge;

    return { totalPrice, breakdown };
  }
}
