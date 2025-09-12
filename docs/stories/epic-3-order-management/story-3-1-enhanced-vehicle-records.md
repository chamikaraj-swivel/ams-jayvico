# Story 3.1: Enhanced Vehicle Records with VIN Linking

## User Story

As an **operations manager**,  
I want **to manage comprehensive vehicle records with VIN linking and specifications**,  
so that **I can track detailed vehicle information throughout the import process**.

## Acceptance Criteria

1. **1:** Vehicle records include VIN, make, model, year, color, engine specifications, and auction details
2. **2:** Vehicle photos can be uploaded and linked to vehicle records
3. **3:** Auction information includes auction house, auction date, lot number, and winning bid
4. **4:** Vehicle specifications are validated against VIN data when available
5. **5:** Vehicle records include import timeline and estimated completion dates
6. **6:** Vehicle records can be updated with additional information as process progresses
7. **7:** Vehicle search and filtering by VIN, make, model, year, and status
8. **8:** Vehicle records are accessible via REST API endpoints
9. **9:** Vehicle data export functionality for reporting and analysis

## Technical Instructions

### Backend Implementation

- Extend vehicle model with comprehensive specifications
- Implement VIN validation and data extraction
- Create photo upload functionality with S3 integration
- Add auction information tracking
- Implement vehicle search and filtering
- Create data export functionality

### Frontend Implementation

- Create enhanced vehicle form with multiple sections
- Implement photo upload interface with preview
- Create auction information section
- Add vehicle specification display
- Implement advanced search and filtering
- Create data export interface

### DynamoDB Schema

```typescript
// Enhanced Vehicles table
{
  PK: "VEHICLE#${vehicleId}",
  SK: "DETAILS",
  vehicleId: string,
  vin: string,
  make: string,
  model: string,
  year: number,
  color: string,
  engineSpecs: {
    displacement: string,
    cylinders: number,
    fuelType: string,
    transmission: string,
    driveType: string,
    horsepower: number
  },
  dimensions: {
    length: number,
    width: number,
    height: number,
    weight: number
  },
  features: string[], // ["Air Conditioning", "Power Steering", etc.]
  condition: "Excellent" | "Good" | "Fair" | "Poor",
  mileage: number,
  auctionDetails: {
    auctionHouse: string,
    auctionDate: string,
    lotNumber: string,
    winningBid: number,
    auctionLocation: string
  },
  photos: string[], // S3 URLs
  importTimeline: {
    estimatedStartDate: string,
    estimatedCompletionDate: string,
    actualStartDate: string,
    actualCompletionDate: string
  },
  status: string, // 15 process stages
  createdAt: string,
  updatedAt: string,
  createdBy: string,
  updatedBy: string
}
```

### API Endpoints

- `GET /vehicles` - List vehicles with advanced search/filter
- `GET /vehicles/:id` - Get vehicle details
- `POST /vehicles` - Create new vehicle
- `PUT /vehicles/:id` - Update vehicle
- `POST /vehicles/:id/photos` - Upload vehicle photos
- `GET /vehicles/search` - Advanced search by multiple criteria
- `GET /vehicles/export` - Export vehicle data
- `POST /vehicles/vin-validate` - Validate VIN and extract data

### VIN Validation

- Validate VIN format (17 characters, alphanumeric)
- Extract make, model, year from VIN when possible
- Validate against known VIN patterns
- Provide VIN decoding service integration

### Photo Management

- Support multiple image formats (JPEG, PNG, WebP)
- Automatic image resizing and optimization
- S3 storage with CDN delivery
- Photo metadata tracking

## Definition of Done

- [ ] Enhanced vehicle form captures all specifications
- [ ] Photo upload functionality works correctly
- [ ] Auction information is properly stored
- [ ] VIN validation extracts data accurately
- [ ] Import timeline tracking works
- [ ] Advanced search and filtering function
- [ ] Data export generates correct format
- [ ] All API endpoints are functional
- [ ] Mobile-responsive design is implemented
- [ ] All tests pass

## Dependencies

- Story 1.1: Project Setup and Infrastructure
- Story 1.2: Authentication and User Management
- Story 1.3: Basic Vehicle Record Management

## Estimated Effort

- **Story Points:** 8
- **Estimated Hours:** 16-24 hours
- **Complexity:** High (VIN validation and photo management)

## Notes

VIN validation requires integration with external services or implementation of VIN decoding algorithms. Photo management needs proper S3 configuration and CDN setup.
