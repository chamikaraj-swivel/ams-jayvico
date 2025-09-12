# Vehicle Import System

A comprehensive vehicle import management system built with React TypeScript frontend and NestJS backend.

## Project Structure

```
vehicle-import-system/
├── frontend/                 # React TypeScript + Redux + Tailwind CSS
├── backend/                  # NestJS + TypeScript
├── shared/                   # Shared types and utilities
├── docs/                     # Documentation
├── docker-compose.yml
├── .github/workflows/
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Google Cloud SDK

### Development Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   # Frontend
   cd frontend && npm install

   # Backend
   cd ../backend && npm install
   ```

3. Set up environment variables (see respective README files)

4. Start development servers:

   ```bash
   # Using Docker Compose
   docker-compose up

   # Or individually
   # Frontend: cd frontend && npm start
   # Backend: cd backend && npm run start:dev
   ```

## Tech Stack

- **Frontend**: React 18, TypeScript, Redux Toolkit, Tailwind CSS
- **Backend**: NestJS, TypeScript, Google Cloud Firestore
- **Infrastructure**: Docker, Google Cloud Platform
- **CI/CD**: GitHub Actions

## Documentation

- [Product Requirements Document](docs/prd.md)
- [User Stories](docs/stories/)
- [Architecture Documentation](docs/architecture/)

## Contributing

Please read our contributing guidelines and follow the development standards outlined in the architecture documentation.

