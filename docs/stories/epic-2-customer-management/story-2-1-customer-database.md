# Story 2.1: Customer Database and Segmentation

## User Story

As a **customer service representative**,  
I want **to manage customer records with segmentation capabilities**,  
so that **I can efficiently organize and access customer information based on their import patterns and preferences**.

## Acceptance Criteria

1. **1:** Customer registration form captures name, contact information, address, and business details
2. **2:** Customer records include segmentation fields (vehicle type preference, region, import frequency, payment status)
3. **3:** Customer list view displays all customers with search, filter, and sorting capabilities
4. **4:** Customer detail view shows complete profile with import history and preferences
5. **5:** Customer records can be updated and edited by authorized users
6. **6:** Customer segmentation allows filtering by vehicle type, region, import frequency, and payment status
7. **7:** Customer records include creation timestamp and last updated information
8. **8:** Customer data is accessible via REST API endpoints
9. **9:** Customer records can be deactivated with proper confirmation

## Technical Instructions

### Backend Implementation

- Create customer model with DynamoDB schema
- Implement CRUD operations for customers
- Add segmentation logic for filtering
- Create search functionality across multiple fields
- Implement customer deactivation (soft delete)
- Add audit logging for customer operations

### Frontend Implementation

- Create customer registration form with Tailwind CSS
- Implement customer list view with advanced filtering
- Create customer detail view with edit capabilities
- Add segmentation filters and sorting options
- Implement responsive design for mobile access
- Create customer deactivation confirmation

### DynamoDB Schema

```typescript
// Customers table
{
  PK: "CUSTOMER#${customerId}",
  SK: "PROFILE",
  customerId: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  businessDetails: {
    companyName: string,
    businessType: string,
    taxId: string
  },
  preferences: {
    vehicleType: string[], // ["Sedan", "SUV", "Truck", "Motorcycle"]
    region: string,
    importFrequency: "One-time" | "Monthly" | "Quarterly" | "Yearly",
    paymentMethod: "Bank Transfer" | "Credit Card" | "Cash"
  },
  status: "Active" | "Inactive" | "Suspended",
  createdAt: string,
  updatedAt: string,
  createdBy: string,
  updatedBy: string
}
```

### API Endpoints

- `GET /customers` - List customers with search/filter/sort
- `GET /customers/:id` - Get customer details
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Deactivate customer
- `GET /customers/segments` - Get customer segmentation data
- `GET /customers/search` - Search customers by multiple criteria

### Segmentation Fields

- **Vehicle Type Preference:** Sedan, SUV, Truck, Motorcycle, etc.
- **Region:** Geographic location for import patterns
- **Import Frequency:** One-time, Monthly, Quarterly, Yearly
- **Payment Status:** Current, Overdue, Excellent, Good, Fair

## Definition of Done

- [ ] Customer registration form works with validation
- [ ] Customer list displays with all filtering options
- [ ] Customer detail view shows complete information
- [ ] Segmentation filtering works correctly
- [ ] Edit functionality works properly
- [ ] Deactivation confirmation works
- [ ] All API endpoints are functional
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

Customer segmentation is crucial for targeted communication and service. Ensure the segmentation fields are comprehensive and allow for future expansion.
