# Story 4.2: Cash Flow Management Dashboard

## User Story

As a **finance manager**,  
I want **to monitor receivables and payables with profit calculations**,  
so that **I can maintain healthy cash flow and track profitability per vehicle**.

## Acceptance Criteria

1. **1:** Receivables dashboard shows outstanding customer payments by due date
2. **2:** Payables dashboard shows outstanding supplier payments and fees
3. **3:** Profit per vehicle calculation includes all costs and revenues
4. **4:** Cash flow projections based on expected payments and expenses
5. **5:** Payment aging reports for receivables and payables
6. **6:** Cash flow trends and analytics over time
7. **7:** Payment reminder system for overdue payments
8. **8:** Cash flow reporting and export functionality
9. **9:** Integration with external accounting systems

## Technical Instructions

### Backend Implementation

- Create cash flow analytics service
- Implement receivables and payables tracking
- Create profit calculation engine
- Add cash flow projection algorithms
- Implement payment aging analysis
- Create cash flow reporting system

### Frontend Implementation

- Create cash flow dashboard with Tailwind CSS
- Implement receivables and payables views
- Create profit calculation display
- Add cash flow projection charts
- Implement payment aging reports
- Create cash flow export interface

### DynamoDB Schema

```typescript
// Cash Flow Analytics table
{
  PK: "CASHFLOW#ANALYTICS",
  SK: "DATE#${date}",
  date: string,
  receivables: {
    total: number,
    overdue: number,
    current: number,
    aging: {
      "0-30": number,
      "31-60": number,
      "61-90": number,
      "90+": number
    }
  },
  payables: {
    total: number,
    overdue: number,
    current: number,
    aging: {
      "0-30": number,
      "31-60": number,
      "61-90": number,
      "90+": number
    }
  },
  netCashFlow: number,
  profitPerVehicle: number,
  createdAt: string
}

// Cash Flow Projections table
{
  PK: "CASHFLOW#PROJECTION",
  SK: "PERIOD#${period}",
  period: string, // "2024-Q1", "2024-Q2", etc.
  projectedReceivables: number,
  projectedPayables: number,
  projectedNetFlow: number,
  confidence: "High" | "Medium" | "Low",
  createdAt: string
}
```

### API Endpoints

- `GET /cashflow/dashboard` - Get cash flow dashboard data
- `GET /cashflow/receivables` - Get receivables analysis
- `GET /cashflow/payables` - Get payables analysis
- `GET /cashflow/profit-per-vehicle` - Get profit calculations
- `GET /cashflow/projections` - Get cash flow projections
- `GET /cashflow/aging` - Get payment aging reports
- `GET /cashflow/export` - Export cash flow data

### Profit Calculation Formula

```
Profit per Vehicle =
  Customer Payment -
  (Supplier Costs + Bank Fees + Customs Fees + Shipping Costs + Insurance + Overhead)
```

### Cash Flow Projections

- **Short-term (30 days):** Based on confirmed orders
- **Medium-term (90 days):** Based on pipeline and historical data
- **Long-term (1 year):** Based on market trends and business projections

## Definition of Done

- [ ] Receivables dashboard shows accurate data
- [ ] Payables dashboard displays correct information
- [ ] Profit per vehicle calculations are accurate
- [ ] Cash flow projections are reliable
- [ ] Payment aging reports are correct
- [ ] Cash flow trends and analytics work
- [ ] Payment reminder system functions
- [ ] Cash flow reporting and export work
- [ ] Integration with accounting systems works
- [ ] All tests pass

## Dependencies

- Story 1.1: Project Setup and Infrastructure
- Story 1.2: Authentication and User Management
- Story 4.1: Payment Tracking System

## Estimated Effort

- **Story Points:** 8
- **Estimated Hours:** 16-24 hours
- **Complexity:** High (financial calculations and projections)

## Notes

Financial calculations must be accurate and reliable. Ensure all profit calculations are properly validated and cash flow projections are based on sound business logic.
