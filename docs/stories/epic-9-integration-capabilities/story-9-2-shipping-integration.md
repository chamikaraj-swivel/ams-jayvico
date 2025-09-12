# Story 9.2: Shipping Integration and Vessel Tracking

## User Story

As an **operations manager**,  
I want **integrated shipping systems for vessel tracking**,  
so that **I can monitor shipment progress and provide accurate ETAs**.

## Acceptance Criteria

1. **1:** Shipping API integration for vessel tracking
2. **2:** ETA updates and notifications
3. **3:** Port arrival and departure tracking
4. **4:** Demurrage calculation and management
5. **5:** Shipping document management
6. **6:** Container and cargo tracking
7. **7:** Shipping cost analysis and reporting
8. **8:** Integration with multiple shipping lines
9. **9:** Shipping performance analytics

## Technical Instructions

### Backend Implementation

- Create shipping integration service
- Implement vessel tracking API integration
- Add ETA calculation and updates
- Create port tracking system
- Implement demurrage calculation
- Add shipping document management

### Frontend Implementation

- Create shipping integration interface with Tailwind CSS
- Implement vessel tracking dashboard
- Create ETA updates interface
- Add port tracking visualization
- Implement demurrage management interface
- Create shipping analytics dashboard

### DynamoDB Schema

```typescript
// Shipping Integrations table
{
  PK: "SHIPPING#${shippingId}",
  SK: "DETAILS",
  shippingId: string,
  shippingLine: string,
  apiEndpoint: string,
  apiKey: string,
  apiSecret: string,
  isActive: boolean,
  lastSyncAt: string,
  syncStatus: "Active" | "Inactive" | "Error",
  errorMessage: string,
  createdAt: string,
  updatedAt: string
}

// Vessel Tracking table
{
  PK: "VESSEL#${vesselId}",
  SK: "TRACKING#${date}",
  vesselId: string,
  vesselName: string,
  imoNumber: string,
  vehicleId: string,
  containerId: string,
  currentLocation: {
    latitude: number,
    longitude: number,
    port: string,
    country: string
  },
  status: "At Sea" | "In Port" | "Loading" | "Unloading" | "Departed",
  eta: string,
  actualArrival: string,
  departure: string,
  nextPort: string,
  trackingDate: string,
  updatedAt: string
}

// Demurrage Management table
{
  PK: "DEMURRAGE#${demurrageId}",
  SK: "DETAILS",
  demurrageId: string,
  vehicleId: string,
  containerId: string,
  vesselId: string,
  port: string,
  freeTime: number, // in hours
  usedTime: number, // in hours
  demurrageRate: number,
  demurrageAmount: number,
  currency: string,
  status: "Active" | "Calculated" | "Paid" | "Waived",
  calculatedAt: string,
  paidAt: string
}
```

### API Endpoints

- `GET /shipping/integrations` - List shipping integrations
- `POST /shipping/integrations` - Create shipping integration
- `GET /shipping/vessels` - Get vessel tracking data
- `GET /shipping/vessels/:id/tracking` - Get vessel tracking details
- `GET /shipping/etas` - Get ETA updates
- `GET /shipping/demurrage` - Get demurrage calculations
- `POST /shipping/demurrage/calculate` - Calculate demurrage
- `GET /shipping/analytics` - Get shipping analytics

### Shipping Integration Features

- **Vessel Tracking:** Real-time vessel location tracking
- **ETA Updates:** Estimated time of arrival updates
- **Port Tracking:** Port arrival and departure tracking
- **Demurrage Management:** Demurrage calculation and management
- **Document Management:** Shipping document handling
- **Cost Analysis:** Shipping cost analysis and reporting

### Supported Shipping Lines

- **Major Shipping Lines:** Maersk, MSC, CMA CGM, etc.
- **Regional Carriers:** Regional shipping companies
- **Specialized Carriers:** Vehicle-specific carriers
- **Freight Forwarders:** Third-party logistics providers

### Demurrage Calculation

- **Free Time:** Standard free time allowance
- **Used Time:** Actual time used
- **Demurrage Rate:** Rate per day/hour
- **Calculation:** (Used Time - Free Time) × Demurrage Rate

### Vessel Status Types

- **At Sea:** Vessel is sailing
- **In Port:** Vessel is in port
- **Loading:** Vessel is loading cargo
- **Unloading:** Vessel is unloading cargo
- **Departed:** Vessel has departed port

## Definition of Done

- [ ] Shipping API integration for vessel tracking works
- [ ] ETA updates and notifications function
- [ ] Port arrival and departure tracking work
- [ ] Demurrage calculation and management function
- [ ] Shipping document management works
- [ ] Container and cargo tracking function
- [ ] Shipping cost analysis and reporting work
- [ ] Integration with multiple shipping lines functions
- [ ] Shipping performance analytics work
- [ ] All tests pass

## Dependencies

- Story 1.1: Project Setup and Infrastructure
- Story 1.2: Authentication and User Management
- Story 3.2: 15-Step Process Tracking

## Estimated Effort

- **Story Points:** 13
- **Estimated Hours:** 26-39 hours
- **Complexity:** Very High (external API integration and real-time tracking)

## Notes

Shipping integration requires real-time data processing and accurate ETA calculations. Ensure the system can handle various shipping line APIs and provides reliable tracking information.
