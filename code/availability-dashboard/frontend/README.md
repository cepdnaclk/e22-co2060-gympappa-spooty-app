# GympAPPa Spooty App - Frontend README

# GympAPPa Spooty App - Frontend

## Overview

The GympAPPa Spooty App is a web application designed to provide an Equipment Availability Dashboard for gym equipment. This frontend is built using React.js and communicates with a Node.js backend to display real-time availability of gym equipment.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:

   ```
   cd gympappa-spooty-app/frontend
   ```

3. Install the dependencies:

   ```
   npm install
   ```

### Running the Application

To start the development server, run:

```
npm start
```

The application will be available at `http://localhost:3000`.

### Folder Structure

```
frontend
├── src
│   ├── App.tsx
│   ├── index.tsx
│   ├── components
│   │   ├── EquipmentDashboard.tsx
│   │   ├── EquipmentCard.tsx
│   │   └── AvailabilityStatus.tsx
│   ├── pages
│   │   └── Dashboard.tsx
│   ├── hooks
│   │   └── useEquipment.ts
│   ├── types
│   │   └── index.ts
│   └── styles
│       └── App.css
├── package.json
└── tsconfig.json
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.