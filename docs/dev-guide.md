# AMS Development Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Development Environment Setup](#development-environment-setup)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [Development Workflow](#development-workflow)
7. [Testing](#testing)
8. [Database Management](#database-management)
9. [API Documentation](#api-documentation)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)

---

## Project Overview

The **Automotive Management System (AMS)** is a comprehensive vehicle import management platform designed to streamline the complex 15-step vehicle import process. The system provides real-time tracking, automated workflows, and comprehensive management tools for internal staff.

### Key Features

- **Vehicle Import Pipeline**: 15-step process tracking with real-time status updates
- **Customer Management**: Comprehensive CRM with segmentation and communication tools
- **Payment Management**: Cash flow tracking, automated invoicing, and financial reporting
- **Document Management**: Cloud-based repository with OCR scanning and AI validation
- **Operations Dashboard**: Pipeline visibility, task management, and supplier tracking
- **Communication System**: Multi-channel notifications and automated status updates
- **Reporting & Analytics**: Business intelligence and performance metrics
- **Integration Capabilities**: APIs for banks, shipping, customs, and insurance

### Technology Stack

- **Frontend**: React 18, TypeScript, Redux Toolkit, Tailwind CSS
- **Backend**: NestJS, TypeScript, Google Cloud Firestore
- **Infrastructure**: Docker, Google Cloud Platform
- **CI/CD**: GitHub Actions
- **Database**: Google Cloud Firestore (NoSQL)
- **Authentication**: Firebase Authentication with JWT-based backend authentication and role-based access control

---

## Architecture

### System Architecture

The AMS follows a **monolith architecture** with clear separation between frontend and backend services:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │────│   NestJS API    │────│  Google Cloud   │
│   (Port 3000)   │    │   (Port 3001)   │    │   Firestore     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐              ┌─────────┐              ┌─────────┐
    │ Redux   │              │ Modules │              │ Storage │
    │ Store   │              │ Services│              │ Buckets │
    └─────────┘              └─────────┘              └─────────┘
```

### Database Design

The system uses **Google Cloud Firestore** as the primary database with the following main collections:

- **vehicles**: Vehicle records with VIN linking and specifications
- **customers**: Customer database with segmentation
- **orders**: Multi-vehicle order management
- **payments**: Payment tracking and financial records
- **documents**: Document repository with metadata
- **users**: User management and authentication
- **audit_logs**: Complete audit trail for compliance

### Firebase Project Configuration

The project uses Firebase project **jayvico-ams** with the following configuration:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyAs9DUF2Sm8JlHA05J3c_UDmv2SLJzzpm0",
  authDomain: "jayvico-ams.firebaseapp.com",
  projectId: "jayvico-ams",
  storageBucket: "jayvico-ams.firebasestorage.app",
  messagingSenderId: "887968234312",
  appId: "1:887968234312:web:dae1a9f1b401165f46d17d",
  measurementId: "G-ZFSK9XF9XE",
};
```

### API Architecture

The backend follows **RESTful API** principles with:

- **Modular Structure**: Separate modules for each domain (vehicle, customer, payment, etc.)
- **DTO Validation**: Class-validator for request/response validation
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Authentication**: Firebase Authentication with JWT-based backend authentication and role-based access control

---

## Development Environment Setup

### Prerequisites

- **Node.js**: Version 20+ (LTS recommended) - Required for Firebase v10+
- **Docker**: Version 20+ with Docker Compose
- **Google Cloud SDK**: For Firestore emulator and deployment
- **Git**: Version control
- **VS Code**: Recommended IDE with extensions

### Required VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json",
    "firebase.vscode-firebase-explorer",
    "ms-vscode.vscode-docker"
  ]
}
```

### Initial Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd ams-jayvico
   ```

2. **Install dependencies**:

   ```bash
   # Backend dependencies
   cd backend
   npm install

   # Frontend dependencies
   cd ../frontend
   npm install

   # Install Firebase SDK
   npm install firebase
   ```

3. **Environment Configuration**:

   ```bash
   # Backend environment
   cp backend/env.example backend/.env

   # Frontend environment
   cp frontend/env.example frontend/.env
   ```

4. **Firebase Setup**:

   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase in your project
   firebase init firestore
   firebase init auth
   ```

   **Note**: Firebase v10+ requires Node.js 20+. Make sure you're using the correct Node version:

   ```bash
   nvm use 20.19.5  # or latest LTS version
   ```

5. **Firebase Authentication Setup**:

   Create a Firebase configuration file for the frontend:

   ```typescript
   // frontend/src/config/firebase.ts
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";
   import { getAnalytics } from "firebase/analytics";

   const firebaseConfig = {
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.REACT_APP_FIREBASE_APP_ID,
     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
   };

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const analytics = getAnalytics(app);
   export default app;
   ```

   Create a Firebase authentication service:

   ```typescript
   // frontend/src/services/firebaseAuth.ts
   import {
     signInWithEmailAndPassword,
     createUserWithEmailAndPassword,
     signOut,
     onAuthStateChanged,
     User,
     UserCredential,
   } from "firebase/auth";
   import { auth } from "../config/firebase";

   export class FirebaseAuthService {
     static async signIn(
       email: string,
       password: string
     ): Promise<UserCredential> {
       return await signInWithEmailAndPassword(auth, email, password);
     }

     static async signUp(
       email: string,
       password: string
     ): Promise<UserCredential> {
       return await createUserWithEmailAndPassword(auth, email, password);
     }

     static async signOut(): Promise<void> {
       await signOut(auth);
     }

     static getCurrentUser(): User | null {
       return auth.currentUser;
     }

     static onAuthStateChanged(
       callback: (user: User | null) => void
     ): () => void {
       return onAuthStateChanged(auth, callback);
     }
   }
   ```

6. **Firebase Authentication Integration**:

   The application uses **direct Firebase Authentication**:

   - **Frontend**: Firebase Authentication handles all user authentication
   - **Backend**: Optional - can verify Firebase tokens for API access
   - **Integration**: Firebase ID tokens are used for API authentication

   **Authentication Flow**:

   1. User signs in with Firebase Auth (Email/Password)
   2. Frontend gets Firebase ID token
   3. Firebase token is used for API authentication
   4. No backend JWT tokens required

   **Benefits**:

   - ✅ Simplified authentication flow
   - ✅ No backend authentication complexity
   - ✅ Firebase handles security, password policies, etc.
   - ✅ Automatic token refresh
   - ✅ Built-in user management

7. **Start development environment**:

   ```bash
   # Using Docker Compose (Recommended)
   docker-compose -f docker-compose.dev.yml up

   # Or manually
   # Terminal 1: Backend
   cd backend && npm run start:dev

   # Terminal 2: Frontend
   cd frontend && npm start

   # Terminal 3: Firestore Emulator
   firebase emulators:start --only firestore
   ```

### Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api
- **Firestore Emulator**: http://localhost:8080

---

## Project Structure

### Monorepo Structure

```
ams-jayvico/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── common/            # Shared utilities and services
│   │   ├── config/            # Configuration files
│   │   ├── modules/           # Feature modules
│   │   │   ├── customer/      # Customer management
│   │   │   ├── vehicle/       # Vehicle management
│   │   │   ├── health/        # Health checks
│   │   │   └── ...
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Application entry point
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store and slices
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   └── App.tsx           # Root component
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── package.json
│   └── tailwind.config.js
├── shared/                     # Shared types and utilities
│   └── types/
│       └── index.ts
├── docs/                       # Documentation
│   ├── prd.md                 # Product Requirements
│   ├── stories/               # User stories
│   └── dev-guide.md           # This file
├── docker-compose.yml          # Production Docker setup
├── docker-compose.dev.yml     # Development Docker setup
└── README.md
```

### Backend Module Structure

Each backend module follows this structure:

```
modules/[feature]/
├── dto/                       # Data Transfer Objects
│   └── [feature].dto.ts
├── [feature].controller.ts    # REST API endpoints
├── [feature].service.ts      # Business logic
├── [feature].module.ts       # Module definition
└── [feature].spec.ts         # Unit tests
```

### Frontend Component Structure

```
src/
├── components/                # Reusable components
│   ├── Header.tsx
│   ├── Layout.tsx
│   └── ...
├── pages/                     # Page components
│   ├── Dashboard.tsx
│   ├── VehicleRecords.tsx
│   └── CustomerManagement.tsx
├── store/                     # Redux store
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── vehicleSlice.ts
│   │   └── customerSlice.ts
│   └── store.ts
├── services/                  # API services
│   ├── api.ts
│   ├── vehicleService.ts
│   └── customerService.ts
└── utils/                     # Utility functions
    ├── constants.ts
    ├── helpers.ts
    └── validation.ts
```

---

## Coding Standards

### TypeScript Standards

#### Naming Conventions

- **Files**: kebab-case (`vehicle-service.ts`, `customer-dto.ts`)
- **Classes**: PascalCase (`VehicleService`, `CustomerController`)
- **Interfaces**: PascalCase with `I` prefix (`IVehicle`, `ICustomer`)
- **Enums**: PascalCase (`VehicleStatus`, `UserRole`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Variables/Functions**: camelCase (`vehicleId`, `getVehicleById`)

#### Code Organization

```typescript
// 1. Imports (external libraries first, then internal)
import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../common/firestore/firestore.service";

// 2. Interfaces and Types
interface VehicleCreateRequest {
  vin: string;
  make: string;
  model: string;
}

// 3. Class Definition
@Injectable()
export class VehicleService {
  // 4. Constructor
  constructor(private readonly firestoreService: FirestoreService) {}

  // 5. Public methods
  async createVehicle(data: VehicleCreateRequest): Promise<Vehicle> {
    // Implementation
  }

  // 6. Private methods
  private validateVin(vin: string): boolean {
    // Implementation
  }
}
```

#### Error Handling

```typescript
// Use specific NestJS exceptions
import { NotFoundException, BadRequestException } from '@nestjs/common';

async findVehicle(id: string): Promise<Vehicle> {
  try {
    const vehicle = await this.firestoreService.getVehicle(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new BadRequestException('Failed to retrieve vehicle');
  }
}
```

### React Standards

#### Component Structure

```typescript
// 1. Imports
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// 2. Types and Interfaces
interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (id: string) => void;
}

// 3. Component Definition
export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onEdit,
}) => {
  // 4. Hooks
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // 5. Event Handlers
  const handleEdit = () => {
    onEdit(vehicle.id);
  };

  // 6. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 7. Render
  return <div className="vehicle-card">{/* JSX content */}</div>;
};
```

#### State Management (Redux Toolkit)

```typescript
// Slice Definition
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
}

// Async Thunks
export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await vehicleService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    loading: false,
    error: null,
  } as VehicleState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
```

### API Standards

#### RESTful Endpoints

```typescript
// Controller Structure
@Controller("vehicles")
@ApiTags("vehicles")
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({ summary: "Create a new vehicle" })
  @ApiResponse({ status: 201, description: "Vehicle created successfully" })
  async create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all vehicles" })
  @ApiQuery({ name: "status", required: false })
  async findAll(@Query("status") status?: string): Promise<Vehicle[]> {
    return this.vehicleService.findAll(status);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get vehicle by ID" })
  @ApiParam({ name: "id", description: "Vehicle ID" })
  async findOne(@Param("id") id: string): Promise<Vehicle> {
    return this.vehicleService.findOne(id);
  }
}
```

#### DTO Validation

```typescript
export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Vehicle VIN number" })
  vin: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Vehicle make" })
  make: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Vehicle model" })
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @ApiProperty({ description: "Vehicle year" })
  year: number;
}
```

---

## Development Workflow

### Git Workflow

1. **Branch Naming**:

   - Feature: `feature/vehicle-tracking`
   - Bugfix: `bugfix/payment-calculation`
   - Hotfix: `hotfix/security-patch`
   - Release: `release/v1.2.0`

2. **Commit Messages**:

   ```
   type(scope): description

   feat(vehicle): add VIN validation
   fix(payment): correct tax calculation
   docs(api): update endpoint documentation
   test(auth): add unit tests for login
   ```

3. **Pull Request Process**:
   - Create feature branch from `main`
   - Implement changes with tests
   - Create PR with detailed description
   - Request code review
   - Address feedback and merge

### Development Commands

```bash
# Backend Development
cd backend
npm run start:dev          # Start development server
npm run build              # Build for production
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Frontend Development
cd frontend
npm start                  # Start development server
npm run build              # Build for production
npm test                   # Run tests
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Docker Development
docker-compose -f docker-compose.dev.yml up    # Start all services
docker-compose -f docker-compose.dev.yml down  # Stop all services
docker-compose -f docker-compose.dev.yml logs  # View logs
```

### Code Quality Tools

#### ESLint Configuration

```json
{
  "extends": ["@nestjs/eslint-config-nestjs", "prettier"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## Testing

### Testing Strategy

The AMS implements a comprehensive testing strategy:

- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user workflows
- **Manual Testing**: Field operations and edge cases

### Backend Testing

#### Unit Tests

```typescript
// vehicle.service.spec.ts
describe("VehicleService", () => {
  let service: VehicleService;
  let firestoreService: FirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: FirestoreService,
          useValue: {
            getVehiclesCollection: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    firestoreService = module.get<FirestoreService>(FirestoreService);
  });

  describe("create", () => {
    it("should create a vehicle successfully", async () => {
      const createVehicleDto = {
        vin: "1HGBH41JXMN109186",
        make: "Honda",
        model: "Civic",
        year: 2021,
        color: "Silver",
      };

      const mockDocRef = { id: "vehicle-123" };
      jest.spyOn(firestoreService, "getVehiclesCollection").mockReturnValue({
        add: jest.fn().mockResolvedValue(mockDocRef),
      } as any);

      const result = await service.create(createVehicleDto);

      expect(result).toHaveProperty("id", "vehicle-123");
      expect(result).toMatchObject(createVehicleDto);
    });
  });
});
```

#### Integration Tests

```typescript
// vehicle.controller.spec.ts
describe("VehicleController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/vehicles (POST)", () => {
    return request(app.getHttpServer())
      .post("/vehicles")
      .send({
        vin: "1HGBH41JXMN109186",
        make: "Honda",
        model: "Civic",
        year: 2021,
        color: "Silver",
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body.make).toBe("Honda");
      });
  });
});
```

### Frontend Testing

#### Component Tests

```typescript
// VehicleCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { VehicleCard } from "./VehicleCard";
import { store } from "../store/store";

const mockVehicle = {
  id: "1",
  vin: "1HGBH41JXMN109186",
  make: "Honda",
  model: "Civic",
  year: 2021,
  color: "Silver",
  status: "pending",
  customerId: "customer-1",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("VehicleCard", () => {
  it("renders vehicle information correctly", () => {
    render(
      <Provider store={store}>
        <VehicleCard vehicle={mockVehicle} onEdit={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText("Honda Civic")).toBeInTheDocument();
    expect(screen.getByText("2021")).toBeInTheDocument();
    expect(screen.getByText("Silver")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const mockOnEdit = jest.fn();
    render(
      <Provider store={store}>
        <VehicleCard vehicle={mockVehicle} onEdit={mockOnEdit} />
      </Provider>
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(mockOnEdit).toHaveBeenCalledWith("1");
  });
});
```

#### Redux Tests

```typescript
// vehicleSlice.test.ts
import vehicleReducer, { fetchVehicles } from "./vehicleSlice";

describe("vehicleSlice", () => {
  const initialState = {
    vehicles: [],
    loading: false,
    error: null,
  };

  it("should handle fetchVehicles.pending", () => {
    const action = { type: fetchVehicles.pending.type };
    const state = vehicleReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle fetchVehicles.fulfilled", () => {
    const mockVehicles = [mockVehicle];
    const action = {
      type: fetchVehicles.fulfilled.type,
      payload: mockVehicles,
    };
    const state = vehicleReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.vehicles).toEqual(mockVehicles);
  });
});
```

### Test Coverage

Run tests with coverage:

```bash
# Backend
cd backend
npm run test:cov

# Frontend
cd frontend
npm test -- --coverage
```

Target coverage: **80%** for critical business logic, **60%** for utility functions.

---

## Database Management

### Firestore Configuration

#### Development Setup

```typescript
// firestore.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";

@Injectable()
export class FirestoreService implements OnModuleInit {
  private firestore: Firestore;

  async onModuleInit() {
    try {
      // Initialize Firestore
      this.firestore = new Firestore({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || "jayvico-ams",
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });

      console.log("✅ Firestore connection initialized");
    } catch (error) {
      console.error("❌ Failed to initialize Firestore:", error);
      throw error;
    }
  }

  getFirestore(): Firestore {
    return this.firestore;
  }

  // Collection references
  getVehiclesCollection() {
    return this.firestore.collection("vehicles");
  }

  getCustomersCollection() {
    return this.firestore.collection("customers");
  }

  getOrdersCollection() {
    return this.firestore.collection("orders");
  }

  getUsersCollection() {
    return this.firestore.collection("users");
  }

  getAuditLogsCollection() {
    return this.firestore.collection("audit_logs");
  }
}
```

#### Data Models

```typescript
// Vehicle Document Structure
interface VehicleDocument {
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  status: VehicleStatus;
  customerId: string;
  specifications?: {
    engine: string;
    transmission: string;
    fuelType: string;
  };
  auctionDetails?: {
    auctionHouse: string;
    auctionDate: string;
    lotNumber: string;
    winningBid: number;
  };
  processSteps: ProcessStep[];
  createdAt: string;
  updatedAt: string;
}

interface ProcessStep {
  step: number;
  name: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  notes?: string;
}
```

#### Indexes

Create Firestore indexes for optimal query performance:

```json
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "customerId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    }
  ]
}
```

### Data Migration

For schema changes, create migration scripts:

```typescript
// migrations/add-process-steps.ts
export async function addProcessStepsToVehicles() {
  const vehicles = await firestore.collection("vehicles").get();

  const batch = firestore.batch();

  vehicles.docs.forEach((doc) => {
    const vehicleData = doc.data();
    if (!vehicleData.processSteps) {
      batch.update(doc.ref, {
        processSteps: generateDefaultProcessSteps(),
        updatedAt: new Date().toISOString(),
      });
    }
  });

  await batch.commit();
}
```

---

## API Documentation

### Swagger/OpenAPI

The API documentation is automatically generated using Swagger:

- **Development**: http://localhost:3001/api
- **Production**: https://api.ams.com/api

#### API Documentation Setup

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

const config = new DocumentBuilder()
  .setTitle("AMS API")
  .setDescription("Automotive Management System API")
  .setVersion("1.0")
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup("api", app, document);
```

#### API Endpoints

##### Vehicle Management

```typescript
POST   /vehicles              # Create vehicle
GET    /vehicles              # Get all vehicles
GET    /vehicles/:id          # Get vehicle by ID
PUT    /vehicles/:id          # Update vehicle
DELETE /vehicles/:id          # Delete vehicle
GET    /vehicles/search      # Search vehicles
```

##### Customer Management

```typescript
POST   /customers             # Create customer
GET    /customers             # Get all customers
GET    /customers/:id         # Get customer by ID
PUT    /customers/:id         # Update customer
DELETE /customers/:id         # Delete customer
GET    /customers/:id/vehicles # Get customer vehicles
```

##### Payment Management

```typescript
POST   /payments              # Create payment
GET    /payments              # Get all payments
GET    /payments/:id          # Get payment by ID
PUT    /payments/:id          # Update payment
GET    /payments/dashboard    # Get payment dashboard
```

### API Response Format

All API responses follow this standard format:

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Error Handling

```typescript
interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}
```

---

## Deployment

### Environment Configuration

#### Development Environment

```bash
# Backend (.env)
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
FIRESTORE_EMULATOR_HOST=localhost:8080
FIRESTORE_EMULATOR_PROJECT_ID=jayvico-ams
```

#### Production Environment

```bash
# Backend (.env)
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://ams.com
GOOGLE_CLOUD_PROJECT_ID=jayvico-ams
GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json
```

### Docker Deployment

#### Production Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=https://api.ams.com
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - FRONTEND_URL=https://ams.com
    volumes:
      - ./service-account.json:/app/service-account.json:ro
```

#### Dockerfile Optimization

```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

### Google Cloud Deployment

#### Cloud Run Deployment

```bash
# Build and deploy backend
gcloud builds submit --tag gcr.io/jayvico-ams/ams-backend ./backend
gcloud run deploy ams-backend \
  --image gcr.io/jayvico-ams/ams-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Build and deploy frontend
gcloud builds submit --tag gcr.io/jayvico-ams/ams-frontend ./frontend
gcloud run deploy ams-frontend \
  --image gcr.io/jayvico-ams/ams-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Firestore Production Setup

```bash
# Initialize Firestore
gcloud firestore databases create --region=us-central1

# Deploy indexes
gcloud firestore indexes composite create \
  --collection-group=vehicles \
  --field-config field-path=status,order=ascending \
  --field-config field-path=createdAt,order=descending
```

### CI/CD Pipeline

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci

      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}

      - name: Deploy Backend
        run: |
          cd backend
          gcloud builds submit --tag gcr.io/jayvico-ams/ams-backend
          gcloud run deploy ams-backend --image gcr.io/jayvico-ams/ams-backend

      - name: Deploy Frontend
        run: |
          cd frontend
          gcloud builds submit --tag gcr.io/jayvico-ams/ams-frontend
          gcloud run deploy ams-frontend --image gcr.io/jayvico-ams/ams-frontend
```

---

## Troubleshooting

### Common Issues

#### 1. Firestore Connection Issues

**Problem**: Cannot connect to Firestore emulator

```
Error: Could not load the default credentials
```

**Solution**:

```bash
# Check emulator status
firebase emulators:start --only firestore

# Verify environment variables
echo $FIRESTORE_EMULATOR_HOST
echo $FIRESTORE_EMULATOR_PROJECT_ID
```

#### 2. CORS Issues

**Problem**: Frontend cannot connect to backend API

```
Access to fetch at 'http://localhost:3001/vehicles' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:

```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
});
```

#### 3. Docker Build Issues

**Problem**: Docker build fails with permission errors

```
npm ERR! code EACCES
```

**Solution**:

```dockerfile
# Add user to avoid permission issues
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs
```

#### 4. Memory Issues

**Problem**: Application runs out of memory

```
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solution**:

```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 dist/main.js

# Or in package.json
"start:prod": "node --max-old-space-size=4096 dist/main"
```

### Debugging Tools

#### Backend Debugging

```typescript
// Enable debug logging
import { Logger } from "@nestjs/common";

@Injectable()
export class VehicleService {
  private readonly logger = new Logger(VehicleService.name);

  async createVehicle(data: CreateVehicleDto): Promise<Vehicle> {
    this.logger.debug("Creating vehicle with data:", data);

    try {
      const result = await this.firestoreService.createVehicle(data);
      this.logger.log("Vehicle created successfully:", result.id);
      return result;
    } catch (error) {
      this.logger.error("Failed to create vehicle:", error);
      throw error;
    }
  }
}
```

#### Frontend Debugging

```typescript
// Redux DevTools
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    vehicles: vehicleReducer,
    customers: customerReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
```

### Performance Monitoring

#### Backend Monitoring

```typescript
// Add performance middleware
import { LoggerMiddleware } from "./common/middleware/logger.middleware";

app.use(LoggerMiddleware);
```

#### Frontend Monitoring

```typescript
// Add performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## Contributing

### Development Guidelines

1. **Code Review Process**:

   - All code must be reviewed by at least one team member
   - Automated tests must pass
   - Code coverage must meet minimum requirements
   - Documentation must be updated

2. **Commit Standards**:

   - Use conventional commit messages
   - Keep commits focused and atomic
   - Include tests for new features
   - Update documentation as needed

3. **Branch Management**:
   - Create feature branches from `main`
   - Keep branches up to date with `main`
   - Delete branches after merging
   - Use descriptive branch names

### Code Review Checklist

- [ ] Code follows TypeScript and React standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Performance considerations are addressed
- [ ] Security best practices are followed

### Getting Help

- **Documentation**: Check this guide and PRD
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions
- **Code Review**: Request reviews from team members

---

## Conclusion

This development guide provides comprehensive information for developing the AMS system. Follow these guidelines to ensure consistent, high-quality code and smooth development workflow.

For additional information, refer to:

- [Product Requirements Document](prd.md)
- [User Stories](stories/)
- [API Documentation](http://localhost:3001/api)

Remember to keep this guide updated as the project evolves and new patterns emerge.
