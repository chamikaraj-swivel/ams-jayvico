# Story 3.3: Multi-Vehicle Order Management

## User Story

As a **customer service representative**,  
I want **to manage multiple vehicles for the same customer in a single order**,  
so that **I can efficiently handle customers importing multiple vehicles simultaneously**.

## Acceptance Criteria

1. **1:** Order creation allows adding multiple vehicles to a single order
2. **2:** Order view displays all vehicles with their individual process status
3. **3:** Order-level tracking shows overall progress across all vehicles
4. **4:** Order management allows adding or removing vehicles before process completion
5. **5:** Order-level communication and notifications for all vehicles
6. **6:** Order-level reporting and analytics across all vehicles
7. **7:** Order status tracking independent of individual vehicle status
8. **8:** Order history maintains complete audit trail of all changes
9. **9:** Order integration with customer records and payment management

## Technical Instructions

### Backend Implementation

- Create order model with DynamoDB schema
- Implement multi-vehicle order management
- Create order-level status tracking
- Add order communication system
- Implement order analytics and reporting
- Create order audit trail

### Frontend Implementation

- Create order creation interface with Tailwind CSS
- Implement multi-vehicle selection interface
- Create order overview dashboard
- Add order management controls
- Implement order communication interface
- Create order analytics dashboard

### DynamoDB Schema

```typescript
// Orders table
{
  PK: "ORDER#${orderId}",
  SK: "DETAILS",
  orderId: string,
  customerId: string,
  orderNumber: string,
  status: "Draft" | "Confirmed" | "In Progress" | "Completed" | "Cancelled",
  vehicles: string[], // Array of vehicle IDs
  totalVehicles: number,
  completedVehicles: number,
  orderValue: number,
  currency: string,
  orderDate: string,
  estimatedCompletionDate: string,
  actualCompletionDate: string,
  notes: string,
  createdAt: string,
  updatedAt: string,
  createdBy: string,
  updatedBy: string
}

// Order Vehicles table
{
  PK: "ORDER#${orderId}",
  SK: "VEHICLE#${vehicleId}",
  orderId: string,
  vehicleId: string,
  addedDate: string,
  status: "Added" | "Removed" | "Active",
  notes: string
}
```

### API Endpoints

- `GET /orders` - List orders with filters
- `GET /orders/:id` - Get order details
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order
- `POST /orders/:id/vehicles` - Add vehicle to order
- `DELETE /orders/:id/vehicles/:vehicleId` - Remove vehicle from order
- `GET /orders/:id/analytics` - Get order analytics
- `GET /orders/:id/communication` - Get order communications

### Order Status Logic

- **Draft:** Order created but not confirmed
- **Confirmed:** Customer has confirmed the order
- **In Progress:** At least one vehicle is in process
- **Completed:** All vehicles have completed the process
- **Cancelled:** Order has been cancelled

## Definition of Done

- [ ] Order creation allows multiple vehicle selection
- [ ] Order view displays all vehicles with status
- [ ] Order-level tracking shows overall progress
- [ ] Vehicle addition/removal works correctly
- [ ] Order-level communication functions
- [ ] Order analytics provide accurate insights
- [ ] Order status tracking works independently
- [ ] Order history maintains complete audit trail
- [ ] Integration with customer and payment systems works
- [ ] All tests pass

## Dependencies

- Story 1.1: Project Setup and Infrastructure
- Story 1.2: Authentication and User Management
- Story 1.3: Basic Vehicle Record Management
- Story 2.1: Customer Database and Segmentation

## Estimated Effort

- **Story Points:** 8
- **Estimated Hours:** 16-24 hours
- **Complexity:** High (multi-entity management)

## Notes

Multi-vehicle orders require careful management of relationships between orders, vehicles, and customers. Ensure the order status logic handles all edge cases properly.
