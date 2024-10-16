import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Room Types
  const roomTypesData = [
    {
      name: 'Junior Suite',
      baseRate: 60,
      maxOccupancy: 2,
      beds: 1,
      oceanView: false,
    },
    {
      name: 'King Suite',
      baseRate: 90,
      maxOccupancy: 4,
      beds: 2,
      oceanView: true,
    },
    {
      name: 'Presidential Suite',
      baseRate: 150,
      maxOccupancy: 6,
      beds: 3,
      oceanView: true,
    },
  ];

  for (const roomTypeData of roomTypesData) {
    await prisma.roomType.upsert({
      where: { name: roomTypeData.name },
      update: {},
      create: roomTypeData,
    });
  }

  // Create Rooms
  const roomTypes = await prisma.roomType.findMany();
  for (const roomType of roomTypes) {
    for (let i = 1; i <= 10; i++) {
      const roomNumber = `${roomType.name.substring(0, 2)}-${i}`;
      // Check if the room already exists
      await prisma.room.upsert({
        where: { roomNumber: roomNumber },
        update: {},
        create: {
          roomNumber: roomNumber,
          roomTypeId: roomType.id,
        },
      });
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
