import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Module({
  providers: [PricingService],
  exports: [PricingService], // Export the service
})
export class PricingModule {}
