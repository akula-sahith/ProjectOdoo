# AssetFlow ERP - API Reference Documentation

This document describes the request/response details for the AssetFlow ERP Backend REST APIs.

## Global Headers
All state-changing endpoints accept JSON request bodies.
- `Content-Type: application/json`

---

## 1. Organization Module

### Departments

#### 1. Create a Department
- **URL**: `/departments`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "department_name": "String (Required)",
    "parent_department_id": "Integer (Optional)",
    "department_head_id": "Integer (Optional)",
    "status": "ACTIVE | INACTIVE (Optional, Default: ACTIVE)"
  }
  ```
- **Success Response (HTTP 201)**:
  ```json
  {
    "success": true,
    "data": {
      "department_id": 1,
      "department_name": "Engineering",
      "parent_department_id": null,
      "department_head_id": null,
      "status": "ACTIVE",
      "created_at": "2026-07-12T07:17:08.000Z"
    }
  }
  ```

#### 2. Get All Departments
- **URL**: `/departments`
- **Method**: `GET`
- **Success Response (HTTP 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "department_id": 1,
        "department_name": "Engineering",
        "parent_department_id": null,
        "department_head_id": null,
        "status": "ACTIVE",
        "created_at": "2026-07-12T07:17:08.000Z",
        "subDepartments": []
      }
    ]
  }
  ```

#### 3. Update Department
- **URL**: `/departments/:id`
- **Method**: `PUT`
- **Body Schema**: All fields optional.
- **Success Response (HTTP 200)**:
  ```json
  {
    "success": true,
    "data": {
      "department_id": 1,
      "department_name": "Engineering & Technology",
      "status": "ACTIVE"
    }
  }
  ```

#### 4. Delete Department
- **URL**: `/departments/:id`
- **Method**: `DELETE`
- **Success Response (HTTP 200)**:
  ```json
  {
    "success": true,
    "message": "Department deleted successfully"
  }
  ```

### Roles

#### 1. Get All Roles
- **URL**: `/roles`
- **Method**: `GET`
- **Success Response (HTTP 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "role_id": 1,
        "role_name": "ADMIN",
        "description": "Administrator with full system access"
      }
    ]
  }
  ```

### Users

#### 1. Create a User
- **URL**: `/users`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "employee_code": "String (Required)",
    "full_name": "String (Required)",
    "email": "String (Required, Unique)",
    "password": "String (Required)",
    "role_id": "Integer (Required)",
    "department_id": "Integer (Optional)",
    "status": "ACTIVE | INACTIVE (Optional, Default: ACTIVE)"
  }
  ```
- **Success Response (HTTP 201)**:
  ```json
  {
    "success": true,
    "data": {
      "user_id": 1,
      "employee_code": "EMP001",
      "full_name": "John Doe",
      "email": "john.doe@company.com",
      "role_id": 1,
      "department_id": 1,
      "status": "ACTIVE"
    }
  }
  ```

---

## 2. Assets Module

### Asset Categories

#### 1. Create a Category
- **URL**: `/categories`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "category_name": "String (Required)",
    "description": "String (Optional)",
    "warranty_period": "Integer (Optional, months)",
    "status": "ACTIVE | INACTIVE (Optional, Default: ACTIVE)"
  }
  ```

#### 2. Get Categories
- **URL**: `/categories`
- **Method**: `GET`

### Assets

#### 1. Create an Asset
- **URL**: `/assets`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "asset_tag": "String (Optional, Auto-generated if missing as AF-XXXX)",
    "asset_name": "String (Required)",
    "serial_number": "String (Required, Unique)",
    "category_id": "Integer (Required)",
    "purchase_date": "Date ISO String (Optional)",
    "purchase_cost": "Decimal (Optional)",
    "condition": "NEW | GOOD | FAIR | POOR | DAMAGED (Required)",
    "status": "AVAILABLE | ALLOCATED | RESERVED | UNDER_MAINTENANCE | LOST | RETIRED | DISPOSED (Required)",
    "location": "String (Optional)",
    "is_bookable": "Boolean (Optional, Default: false)",
    "photo_url": "String (Optional)"
  }
  ```

---

## 3. Allocation Module

#### 1. Allocate Asset
- **URL**: `/allocations`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "asset_id": "Integer (Required)",
    "employee_id": "Integer (Required)",
    "allocated_by": "Integer (Optional, defaults to logged-in user ID)",
    "expected_return_date": "Date ISO String (Optional)"
  }
  ```
- **Validation**: Enforces that the asset must be in `AVAILABLE` status and have no active allocation.

#### 2. Return Asset
- **URL**: `/allocations/:id/return`
- **Method**: `PUT`
- **Body Schema**:
  ```json
  {
    "checkin_notes": "String (Optional)"
  }
  ```

---

## 4. Transfer Module

#### 1. Request Transfer
- **URL**: `/transfers`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "asset_id": "Integer (Required)",
    "to_employee": "Integer (Required)",
    "from_employee": "Integer (Optional, defaults to current owner)"
  }
  ```

#### 2. Complete Transfer
- **URL**: `/transfers/:id/complete`
- **Method**: `PUT`
- **Validation**: Transitions the transfer status to `COMPLETED`, returns the active allocation of the source employee, and creates a new active allocation for the target employee.

---

## 5. Booking Module

#### 1. Book Resource
- **URL**: `/bookings`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "asset_id": "Integer (Required)",
    "employee_id": "Integer (Required)",
    "department_id": "Integer (Optional)",
    "start_time": "Date ISO String (Required)",
    "end_time": "Date ISO String (Required)"
  }
  ```
- **Validation**: Verifies asset has `is_bookable = true` and performs overlap query: start_time < end_time and does not overlap with existing non-cancelled bookings.

---

## 6. Maintenance Module

#### 1. Raise Request
- **URL**: `/maintenance`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "asset_id": "Integer (Required)",
    "priority": "LOW | MEDIUM | HIGH | URGENT (Required)",
    "issue_description": "String (Required)"
  }
  ```

#### 2. Update Maintenance Status
- **URL**: `/maintenance/:id/status`
- **Method**: `PUT`
- **Body Schema**:
  ```json
  {
    "status": "PENDING | APPROVED | REJECTED | TECHNICIAN_ASSIGNED | IN_PROGRESS | RESOLVED | CLOSED (Required)",
    "technician_name": "String (Required for TECHNICIAN_ASSIGNED)"
  }
  ```

---

## 7. Audit Module

#### 1. Create Cycle
- **URL**: `/audit/cycles`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "audit_name": "String (Required)",
    "department_id": "Integer (Optional, scope)",
    "start_date": "Date ISO String (Required)",
    "end_date": "Date ISO String (Required)",
    "auditor_ids": "Array of Integers (Optional, user IDs)"
  }
  ```

#### 2. Submit Audit Record
- **URL**: `/audit/records`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "audit_cycle_id": "Integer (Required)",
    "asset_id": "Integer (Required)",
    "verification_status": "VERIFIED | MISSING | DAMAGED (Required)",
    "remarks": "String (Optional)"
  }
  ```
- **Side Effect**: Marks asset `LOST` if `MISSING`, or updates asset condition to `DAMAGED`.

---

## 8. Dashboard, Notifications & Reports

#### 1. Dashboard Stats
- **URL**: `/dashboard/stats`
- **Method**: `GET`

#### 2. List Notifications
- **URL**: `/notifications`
- **Method**: `GET`
- **Query Params**: `is_read=true|false` (Optional)

#### 3. Assets Report
- **URL**: `/reports/assets`
- **Method**: `GET`
- **Query Params**: `category_id`, `condition`, `status`
