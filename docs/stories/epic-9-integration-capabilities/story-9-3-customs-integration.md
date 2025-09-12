# Story 9.3: Customs Integration and Duty Management

## User Story

As an **operations manager**,  
I want **integrated customs systems for duty calculations**,  
so that **I can streamline customs clearance and reduce delays**.

## Acceptance Criteria

1. **1:** Customs API integration for pre-submission
2. **2:** Duty calculation and estimation
3. **3:** Customs clearance status tracking
4. **4:** Document submission automation
5. **5:** Customs fee management
6. **6:** Compliance validation and reporting
7. **7:** Integration with multiple customs systems
8. **8:** Customs performance analytics
9. **9:** Customs integration monitoring

## Technical Instructions

### Backend Implementation

- Create customs integration service
- Implement customs API integration
- Add duty calculation engine
- Create customs clearance tracking
- Implement document submission automation
- Add customs fee management

### Frontend Implementation

- Create customs integration interface with Tailwind CSS
- Implement duty calculation interface
- Create customs clearance tracking dashboard
- Add document submission interface
- Implement customs fee management
- Create customs analytics dashboard

### DynamoDB Schema

```typescript
// Customs Integrations table
{
  PK: "CUSTOMS#${customsId}",
  SK: "DETAILS",
  customsId: string,
  customsOffice: string,
  country: string,
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

// Duty Calculations table
{
  PK: "DUTY#${dutyId}",
  SK: "DETAILS",
  dutyId: string,
  vehicleId: string,
  customsId: string,
  vehicleDetails: {
    make: string,
    model: string,
    year: number,
    engineSize: number,
    fuelType: string
  },
  dutyCalculation: {
    importDuty: number,
    exciseTax: number,
    vat: number,
    totalDuty: number,
    currency: string
  },
  calculationDate: string,
  validityPeriod: string,
  status: "Calculated" | "Approved" | "Expired",
  calculatedBy: string
}

// Customs Clearance table
{
  PK: "CLEARANCE#${clearanceId}",
  SK: "DETAILS",
  clearanceId: string,
  vehicleId: string,
  customsId: string,
  submissionDate: string,
  status: "Submitted" | "Under Review" | "Approved" | "Rejected" | "Cleared",
  clearanceDate: string,
  clearanceNumber: string,
  documents: string[],
  fees: {
    processingFee: number,
    inspectionFee: number,
    storageFee: number,
    totalFees: number
  },
  notes: string,
  processedBy: string
}
```

### API Endpoints

- `GET /customs/integrations` - List customs integrations
- `POST /customs/integrations` - Create customs integration
- `GET /customs/duty-calculations` - Get duty calculations
- `POST /customs/duty-calculations` - Calculate duties
- `GET /customs/clearance` - Get customs clearance status
- `POST /customs/clearance` - Submit for clearance
- `GET /customs/fees` - Get customs fees
- `GET /customs/analytics` - Get customs analytics

### Customs Integration Features

- **Pre-submission:** Submit documents before arrival
- **Duty Calculation:** Automated duty calculation
- **Status Tracking:** Real-time clearance status
- **Document Automation:** Automated document submission
- **Fee Management:** Customs fee tracking and payment
- **Compliance Validation:** Regulatory compliance checking

### Supported Customs Systems

- **National Customs:** Country-specific customs systems
- **Regional Customs:** Regional customs unions
- **International Customs:** International customs systems
- **Port Authorities:** Port-specific customs systems

### Duty Calculation Factors

- **Vehicle Value:** Declared value of the vehicle
- **Vehicle Age:** Age of the vehicle
- **Engine Size:** Engine displacement
- **Fuel Type:** Type of fuel (petrol, diesel, hybrid)
- **Country of Origin:** Country where vehicle was manufactured
- **Trade Agreements:** Applicable trade agreements

### Customs Clearance Status

- **Submitted:** Documents submitted for review
- **Under Review:** Customs reviewing documents
- **Approved:** Clearance approved
- **Rejected:** Clearance rejected
- **Cleared:** Vehicle cleared for import

## Definition of Done

- [ ] Customs API integration for pre-submission works
- [ ] Duty calculation and estimation function
- [ ] Customs clearance status tracking works
- [ ] Document submission automation functions
- [ ] Customs fee management works
- [ ] Compliance validation and reporting function
- [ ] Integration with multiple customs systems works
- [ ] Customs performance analytics function
- [ ] Customs integration monitoring works
- [ ] All tests pass

## Dependencies

- Story 1.1: Project Setup and Infrastructure
- Story 1.2: Authentication and User Management
- Story 3.2: 15-Step Process Tracking

## Estimated Effort

- **Story Points:** 13
- **Estimated Hours:** 26-39 hours
- **Complexity:** Very High (external API integration and regulatory compliance)

## Notes

Customs integration requires careful compliance with regulatory requirements. Ensure all duty calculations are accurate and the system meets customs authority requirements.
