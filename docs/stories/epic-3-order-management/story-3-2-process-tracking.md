# Story 3.2: 15-Step Process Tracking

## User Story

As an **operations manager**,  
I want **to track vehicles through all 15 process steps with real-time status updates**,  
so that **I can monitor progress and identify bottlenecks in the import process**.

## Acceptance Criteria

1. **1:** All 15 process steps are defined and configurable in the system
2. **2:** Vehicle status automatically updates when moving between process steps
3. **3:** Process step timeline tracking shows start date, completion date, and duration
4. **4:** Process step dependencies are enforced (cannot skip required steps)
5. **5:** Process step exceptions and delays are flagged and tracked
6. **6:** Process step completion requires proper documentation and verification
7. **7:** Process step history maintains complete audit trail of all changes
8. **8:** Process step notifications are sent to relevant stakeholders
9. **9:** Process step reporting provides analytics on step duration and bottlenecks

## Technical Instructions

### Backend Implementation

- Create process step model with DynamoDB schema
- Implement process step workflow engine
- Create step transition validation
- Implement timeline tracking and analytics
- Add exception handling and delay tracking
- Create process step reporting

### Frontend Implementation

- Create process step visualization with Tailwind CSS
- Implement step transition interface
- Create timeline view with progress indicators
- Add exception handling interface
- Implement process analytics dashboard
- Create step completion verification

### 15 Process Steps

1. **Customer Vehicle Selection & Advance Payment**
2. **Bidding Process at Japanese Auctions**
3. **Customer Confirmation & LC Opening at Sri Lankan Bank**
4. **Exporter Handling Inspection & Shipping**
5. **Shipment Arrival & Document Processing**
6. **Document Collection from Bank (Clearing Agent/Customer)**
7. **Delivery Order from Shipping Line**
8. **SL Customs Queue & Duty Sheet Generation**
9. **Customer Duty Payment to SL Customs**
10. **Appraiser File Processing**
11. **Vehicle Clearance**
12. **Port Shipment Arrangement**
13. **Demurrage Handling (10-day grace period)**
14. **Vehicle Collection from Port**
15. **Final Handover to Customer**

### DynamoDB Schema

```typescript
// Process Steps table
{
  PK: "VEHICLE#${vehicleId}",
  SK: "PROCESS#${stepNumber}",
  vehicleId: string,
  stepNumber: number,
  stepName: string,
  status: "Not Started" | "In Progress" | "Completed" | "Blocked" | "Exception",
  startDate: string,
  completionDate: string,
  duration: number, // in hours
  assignedTo: string, // User ID
  dependencies: number[], // Step numbers that must be completed first
  requiredDocuments: string[],
  completedDocuments: string[],
  exceptions: string[],
  notes: string,
  createdAt: string,
  updatedAt: string
}

// Process Analytics table
{
  PK: "ANALYTICS#PROCESS",
  SK: "STEP#${stepNumber}#${date}",
  stepNumber: number,
  stepName: string,
  date: string,
  averageDuration: number,
  totalVehicles: number,
  completedVehicles: number,
  blockedVehicles: number,
  exceptionVehicles: number
}
```

### API Endpoints

- `GET /vehicles/:id/process` - Get vehicle process status
- `POST /vehicles/:id/process/:step/start` - Start process step
- `POST /vehicles/:id/process/:step/complete` - Complete process step
- `POST /vehicles/:id/process/:step/block` - Block process step
- `GET /process/steps` - Get all process steps configuration
- `GET /process/analytics` - Get process analytics
- `GET /process/bottlenecks` - Get bottleneck analysis

### Process Step Dependencies

- Step 2 depends on Step 1 (Customer Selection)
- Step 3 depends on Step 2 (Bidding Process)
- Step 4 depends on Step 3 (Customer Confirmation)
- And so on through all 15 steps

## Definition of Done

- [ ] All 15 process steps are defined and configurable
- [ ] Vehicle status updates automatically between steps
- [ ] Timeline tracking shows accurate dates and durations
- [ ] Step dependencies are enforced correctly
- [ ] Exception handling flags delays properly
- [ ] Step completion requires proper verification
- [ ] Process history maintains complete audit trail
- [ ] Notifications are sent to stakeholders
- [ ] Process analytics provide accurate insights
- [ ] All tests pass

## Dependencies

- Story 1.1: Project Setup and Infrastructure
- Story 1.2: Authentication and User Management
- Story 1.3: Basic Vehicle Record Management
- Story 3.1: Enhanced Vehicle Records with VIN Linking

## Estimated Effort

- **Story Points:** 13
- **Estimated Hours:** 26-39 hours
- **Complexity:** Very High (workflow engine and analytics)

## Notes

This is a complex story involving workflow management. Ensure the process step engine is robust and can handle various edge cases and exceptions.
