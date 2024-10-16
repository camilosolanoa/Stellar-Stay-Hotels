# Stellar Stay Hotels - Dynamic Pricing System

This project is a REST API for Stellar Stay Hotels that calculates dynamic room pricing based on various rules like room type, weekends, length of stay, and optional breakfast for guests. The API is built using NestJS, Prisma, PostgreSQL, and Docker.

## Features

- **Room Pricing Calculation**: Dynamic pricing calculation based on room type, weekends, length of stay, and optional breakfast.
- **Reservation Management**: Ability to create, fetch, and cancel reservations.
- **Room Availability**: Fetch available rooms based on filters like check-in/check-out dates and number of guests.
- **PostgreSQL Database**: Persistent data storage for rooms and reservations.
- **Dockerized Environment**: Both the API and PostgreSQL database are containerized with Docker for easy setup and consistency.

## Technologies Used

- **Node.js**: JavaScript runtime
- **NestJS**: Progressive Node.js framework
- **PostgreSQL**: Relational database
- **Prisma**: ORM for database interaction
- **Docker**: Containerization platform
- **TypeScript**: Typed superset of JavaScript

## Getting Started

Follow these instructions to get a copy of the project up and running locally.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/en/download/)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/stellar-stay-api.git
   cd stellar-stay-api
   ```

2. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

3. Access the API on `http://localhost:3000`.


### API Endpoints

1. **Get Available Rooms:**

   ```
   GET /rooms/available
   ```

   - Query Parameters:
     - `checkInDate`: Check-in date (YYYY-MM-DD format).
     - `checkOutDate`: Check-out date (YYYY-MM-DD format).
     - `guests`: Number of guests.
     - `includeBreakfast`: (Optional) Whether breakfast is included (true/false).
     - `roomType`: (Optional) Filter by room type (e.g., Junior Suite).

   Example request:

   ```
   GET http://localhost:3000/rooms/available?checkInDate=2024-10-20&checkOutDate=2024-10-25&guests=2&includeBreakfast=true
   ```

2. **Create a Reservation:**

   ```
   POST /reservations
   ```

   - Request Body (JSON):
     - `roomId`: ID of the room to reserve.
     - `checkInDate`: Check-in date (YYYY-MM-DD).
     - `checkOutDate`: Check-out date (YYYY-MM-DD).
     - `guests`: Number of guests.
     - `includeBreakfast`: Whether breakfast is included (true/false).

   Example request:

   ```json
   POST http://localhost:3000/reservations
   {
     "roomId": 1,
     "checkInDate": "2024-10-20",
     "checkOutDate": "2024-10-25",
     "guests": 2,
     "includeBreakfast": true
   }
   ```

3. **Get Reservation Details:**

   ```
   GET /reservations/:id
   ```

   Example request:

   ```
   GET http://localhost:3000/reservations/1
   ```

4. **Cancel a Reservation:**

   ```
   DELETE /reservations/:id
   ```

   Example request:

   ```
   DELETE http://localhost:3000/reservations/1
   ```

5. **Get All Reservations:**

   ```
   GET /reservations
   ```

   This returns all reservations, categorized as past, ongoing, or future.

### Database

The database is a PostgreSQL instance that runs inside a Docker container. Prisma is used as the ORM to interact with the database.

### Running Migrations

To run migrations, use the following command:

```bash
docker-compose exec api npm run migration:run
```

### Seeding the Database

To seed the database with mock data, use the following command:

```bash
docker-compose exec api npm run seed
```

### Environment Variables

The project uses the following environment variables:

- `DATABASE_URL`: The connection string for the PostgreSQL database.

You can find these variables inside the `docker-compose.yml` file.

### Project Structure

```
stellar-stay-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── rooms/
│   ├── reservations/
│   ├── pricing/
│   ├── prisma.service.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

### Unit Testing

You can run unit tests using the following command:

```bash
npm run test
```

### Stopping the Containers

To stop the running Docker containers, press `Ctrl+C` in the terminal where the containers are running, or run:

```bash
docker-compose down
```

## Dockerized Setup

The project includes a `docker-compose.yml` file for running both the NestJS application and PostgreSQL database in containers.

1. **API Service (`api`)**: The NestJS application is built and run inside this container.
2. **Database Service (`db`)**: PostgreSQL runs inside this container, with a health check to ensure the service is up before starting the API.


