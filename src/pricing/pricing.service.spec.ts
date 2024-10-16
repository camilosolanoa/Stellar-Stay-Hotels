import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';

describe('PricingService', () => {
  let service: PricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricingService],
    }).compile();

    service = module.get<PricingService>(PricingService);
  });

  it('should calculate price correctly', () => {
    const roomType = {
      baseRate: 100,
    } as any;

    const { totalPrice, breakdown } = service.calculatePrice(
      roomType,
      new Date('2023-10-10'),
      new Date('2023-10-15'),
      2,
      true,
    );

    expect(totalPrice).toBeDefined();
    expect(breakdown).toBeDefined();
  });
});
