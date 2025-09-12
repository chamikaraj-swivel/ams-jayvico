# Story 1.3: Basic Vehicle Record Management

## User Story

As an **operations manager**,  
I want **to create and manage basic vehicle records**,  
so that **I can start tracking vehicles through the import process**.

## Acceptance Criteria

1. **1:** Vehicle record creation form captures VIN, make, model, year, and basic specifications
2. **2:** Vehicle records are stored in DynamoDB with proper data validation
3. **3:** Vehicle list view displays all vehicles with search and filter capabilities
4. **4:** Vehicle detail view shows complete vehicle information
5. **5:** Vehicle records can be updated and edited by authorized users
6. **6:** Vehicle status field tracks current process stage (15 predefined stages)
7. **7:** Vehicle records include creation timestamp and last updated information
8. **8:** Vehicle records can be deleted with proper confirmation
9. **9:** Vehicle data is accessible via REST API endpoints

## Technical Instructions

### Backend Implementation

- Create vehicle model with DynamoDB schema
- Implement CRUD operations for vehicles
- Add data validation for VIN format and required fields
- Create search and filter functionality
- Implement soft delete for vehicle records
- Add audit logging for vehicle operations

### Frontend Implementation

- Create vehicle creation form with Tailwind CSS
- Implement vehicle list view with search/filter
- Create vehicle detail view with edit capabilities
- Add confirmation dialogs for delete operations
- Implement responsive design for mobile access
- Create loading states and error handling

### DynamoDB Schema

```typescript
// Vehicles table
{
  PK: "VEHICLE#${vehicleId}",
  SK: "DETAILS",
  vehicleId: string,
  vin: string,
  make: string,
  model: string,
  year: number,
  color: string,
  engineType: string,
  transmission: string,
  fuelType: string,
  mileage: number,
  status: "CustomerSelection" | "BiddingProcess" | "CustomerConfirmation" | "LCOpening" | "ExporterHandling" | "Inspection" | "Shipping" | "ShipmentArrival" | "DocumentProcessing" | "DocumentCollection" | "DeliveryOrder" | "CustomsQueue" | "DutyPayment" | "AppraiserFile" | "VehicleClearance" | "PortShipment" | "DemurrageHandling" | "VehicleCollection" | "FinalHandover",
  createdAt: string,
  updatedAt: string,
  createdBy: string,
  updatedBy: string
}
```

### API Endpoints

- `GET /vehicles` - List vehicles with search/filter
- `GET /vehicles/:id` - Get vehicle details
- `POST /vehicles` - Create new vehicle
- `PUT /vehicles/:id` - Update vehicle
- `DELETE /vehicles/:id` - Soft delete vehicle
- `GET /vehicles/search` - Search vehicles by VIN/make/model

### Form Validation

- VIN: 17 characters, alphanumeric
- Make/Model: Required, minimum 2 characters
- Year: Required, between 1990 and current year + 1
- Color: Required, from predefined list
- Engine Type: Required, from predefined list

## Definition of Done

- [ ] Vehicle creation form works with validation
- [ ] Vehicle list displays correctly with search/filter
- [ ] Vehicle detail view shows all information
- [ ] Edit functionality works properly
- [ ] Delete confirmation works
- [ ] All API endpoints are functional
- [ ] Data validation is enforced
- [ ] Mobile-responsive design is implemented
- [ ] All tests pass

## Dependencies

- Story 1.1: Project Setup and Infrastructure
- Story 1.2: Authentication and User Management

## Estimated Effort

- **Story Points:** 5
- **Estimated Hours:** 10-15 hours
- **Complexity:** Medium

## Notes

This story establishes the core vehicle data model. Ensure the 15 process stages are properly defined and documented for future stories that will implement the actual process tracking.
