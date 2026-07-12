# API Usage Examples - shell curl commands

Here are curl commands demonstrating standard API flows for the AssetFlow system.

## 1. Setup & Config (Organization & Admin)

### Create Engineering Department
```bash
curl -X POST http://localhost:5000/departments \
  -H "Content-Type: application/json" \
  -d '{
    "department_name": "Engineering"
  }'
```

### Create a Role for Asset Manager
```bash
curl -X GET http://localhost:5000/roles
```

### Create an Asset Manager User
```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "employee_code": "EMP010",
    "full_name": "Alice Manager",
    "email": "alice.manager@company.com",
    "password": "securepassword",
    "role_id": 2,
    "department_id": 1
  }'
```

---

## 2. Asset Lifecycle & Allocation

### Create an Asset Category for Laptops
```bash
curl -X POST http://localhost:5000/categories \
  -H "Content-Type: application/json" \
  -d '{
    "category_name": "Laptops",
    "description": "MacBooks and Dell Workstations",
    "warranty_period": 36
  }'
```

### Register a New Laptop (Asset)
```bash
curl -X POST http://localhost:5000/assets \
  -H "Content-Type: application/json" \
  -d '{
    "asset_name": "MacBook Pro 16",
    "serial_number": "SN-MBP16-99021",
    "category_id": 1,
    "condition": "NEW",
    "status": "AVAILABLE",
    "is_bookable": false
  }'
```

### Allocate Laptop to an Employee
```bash
curl -X POST http://localhost:5000/allocations \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": 1,
    "employee_id": 2,
    "allocated_by": 1
  }'
```

### Return the Laptop
```bash
curl -X PUT http://localhost:5000/allocations/1/return \
  -H "Content-Type: application/json" \
  -d '{
    "checkin_notes": "Device returned in good condition. Minor scratch on bottom."
  }'
```

---

## 3. Asset Transfer request

### Request a Transfer to a new Employee
```bash
curl -X POST http://localhost:5000/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": 1,
    "to_employee": 3,
    "requested_by": 2
  }'
```

### Approve & Complete Transfer
```bash
curl -X PUT http://localhost:5000/transfers/1/complete \
  -H "Content-Type: application/json" \
  -d '{
    "completed_by": 1
  }'
```

---

## 4. Resource Booking (Conference Rooms/Projectors)

### Register a Conference Room (Bookable Asset)
```bash
curl -X POST http://localhost:5000/assets \
  -H "Content-Type: application/json" \
  -d '{
    "asset_name": "Main Conference Room",
    "serial_number": "SN-CONF-MAIN-1",
    "category_id": 2,
    "condition": "GOOD",
    "status": "AVAILABLE",
    "is_bookable": true
  }'
```

### Book the Conference Room
```bash
curl -X POST http://localhost:5000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": 2,
    "employee_id": 2,
    "start_time": "2026-07-15T09:00:00Z",
    "end_time": "2026-07-15T11:00:00Z"
  }'
```

---

## 5. Maintenance Tickets

### Raise a Maintenance Request
```bash
curl -X POST http://localhost:5000/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": 1,
    "priority": "HIGH",
    "issue_description": "Battery drains very fast and screen flickers."
  }'
```

### Assign a Technician & Start Work
```bash
curl -X PUT http://localhost:5000/maintenance/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "TECHNICIAN_ASSIGNED",
    "technician_name": "Mike Repair"
  }'
```

---

## 6. Audit & Dashboard

### Submit an Audit Record
```bash
curl -X POST http://localhost:5000/audit/records \
  -H "Content-Type: application/json" \
  -d '{
    "audit_cycle_id": 1,
    "asset_id": 1,
    "verification_status": "VERIFIED",
    "remarks": "Asset located in Dublin office, working properly."
  }'
```

### Fetch Dashboard Analytics
```bash
curl -X GET http://localhost:5000/dashboard/stats
```
