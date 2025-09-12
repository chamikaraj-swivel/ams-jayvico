# Shared Package

This directory contains shared types, utilities, and constants that are used by both the frontend and backend applications.

## Structure

- `types/` - TypeScript interfaces and enums
- `utils/` - Utility functions
- `constants/` - Application constants

## Usage

### Frontend

```typescript
import { Vehicle, VehicleStatus } from "../shared/types";
```

### Backend

```typescript
import { Vehicle, VehicleStatus } from "../shared/types";
```

## Adding New Shared Code

1. Add new types to `types/index.ts`
2. Add utility functions to `utils/`
3. Add constants to `constants/`
4. Export everything from the appropriate index files
5. Update both frontend and backend imports as needed

