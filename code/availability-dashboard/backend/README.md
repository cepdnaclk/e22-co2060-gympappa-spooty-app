# GympAPPa Spooty App - Backend README

# GympAPPa Spooty App - Backend

## Overview

The GympAPPa Spooty App is a web application designed to manage equipment availability in a gym. This backend service is built using Node.js with Express, and it connects to a PostgreSQL database to handle data storage and retrieval.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/gympappa-spooty-app.git
   ```

2. Navigate to the backend directory:

   ```
   cd gympappa-spooty-app/backend
   ```

3. Install the dependencies:

   ```
   npm install
   ```

### Configuration

1. Set up your PostgreSQL database and update the database connection settings in `src/config/database.ts`.

2. Run the database migrations to create the necessary tables:

   ```
   psql -U yourusername -d yourdatabase -f ../database/migrations/initial_schema.sql
   ```

3. Seed the database with initial data:

   ```
   psql -U yourusername -d yourdatabase -f ../database/seeds/equipment_seed.sql
   ```

### Running the Application

To start the server, run:

```
npm start
```

The server will start on the specified port (default is 3000).

### API Endpoints

- `GET /api/equipment`: Fetch all equipment.
- `POST /api/equipment/issue`: Issue equipment.
- `PUT /api/equipment/update`: Update remaining quantities of equipment.

## Folder Structure

```
backend
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── controllers
│   │   └── equipmentController.ts
│   ├── routes
│   │   └── equipmentRoutes.ts
│   ├── models
│   │   └── Equipment.ts
│   ├── middleware
│   │   └── errorHandler.ts
│   ├── config
│   │   └── database.ts
│   └── types
│       └── index.ts
├── package.json
└── tsconfig.json
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.