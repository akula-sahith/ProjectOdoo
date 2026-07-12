# AssetFlow ERP - Frontend Integration Guide

This guide describes how to integrate the React frontend application with the AssetFlow ERP Node.js/Express backend API.

---

## 1. Consistent API Response Format

Every API endpoint responds with a standardized JSON body containing:
*   `success` (boolean): `true` if the request succeeded, `false` otherwise.
*   `message` (string): Description of the outcome or the error message.
*   `data` (object | array | null): Main payload of successful requests.
*   `errors` (array | null): Detailed error lists (typically for request validation issues).

### Response Status Codes:
*   `200 OK`: Request succeeded.
*   `201 Created`: Resource successfully created.
*   `400 Bad Request`: Payload validation failed or bad inputs.
*   `401 Unauthorized`: Token is missing, expired, or invalid.
*   `403 Forbidden`: Authenticated user does not possess the correct RBAC role.
*   `404 Not Found`: Resource or path does not exist.
*   `409 Conflict`: Unique constraint violation (e.g. record with email/code already exists).
*   `429 Too Many Requests`: Rate limiter triggered.
*   `500 Internal Server Error`: Server exception.

---

## 2. API Endpoint Catalog

All routes are mounted under the base path `/api`.

### 1. Authentication (`/api/auth`)
*   `POST /auth/register`: Signup a new user. Mapped payload: `{ employee_code, full_name, email, password, role_id, department_id (optional) }`. Public access.
*   `POST /auth/login`: Signin user. Mapped payload: `{ email, password }`. Returns Access and Refresh JWT tokens. Public access.

### 2. Organization (`/api`)
*   `POST /departments`: Create a department. Admin only.
*   `GET /departments`: Fetch all departments. Secured.
*   `GET /departments/:id`: Fetch department by ID. Secured.
*   `PUT /departments/:id`: Update department details. Admin only.
*   `DELETE /departments/:id`: Delete a department. Admin only.
*   `GET /roles`: Fetch list of available user roles. Secured.
*   `POST /users`: Create user account. Admin/Manager only.
*   `GET /users`: Fetch all user records. Secured.
*   `GET /users/:id`: Fetch user by ID. Secured.
*   `PUT /users/:id`: Update user profile/credentials. Secured.
*   `DELETE /users/:id`: Delete a user. Admin only.

### 3. Assets (`/api`)
*   `POST /categories`: Create category. Admin/Manager only.
*   `GET /categories`: Fetch categories. Secured.
*   `GET /categories/:id`: Fetch category by ID. Secured.
*   `PUT /categories/:id`: Update category. Admin/Manager only.
*   `DELETE /categories/:id`: Delete category. Admin only.
*   `POST /assets`: Add new asset. Admin/Manager only.
*   `GET /assets`: List assets. Accepts query parameters: `status`, `category_id`, `is_bookable`, `search`. Secured.
*   `GET /assets/:id`: Fetch asset details with allocation and booking history. Secured.
*   `PUT /assets/:id`: Update asset properties. Admin/Manager only.
*   `DELETE /assets/:id`: Remove asset. Admin only.

### 4. Allocation (`/api`)
*   `POST /allocations`: Checkout asset. Payload: `{ asset_id, employee_id, expected_return_date (optional) }`. Secured.
*   `GET /allocations`: List checkout logs. Query filters: `status`, `employee_id`, `asset_id`. Secured.
*   `GET /allocations/:id`: Fetch allocation by ID. Secured.
*   `PUT /allocations/:id/return`: Checkin returned asset. Payload: `{ checkin_notes (optional) }`. Secured.

### 5. Transfer (`/api`)
*   `POST /transfers`: Request ownership transfer. Payload: `{ asset_id, to_employee, from_employee (optional) }`. Secured.
*   `GET /transfers`: List transfers. Query filters: `status`, `asset_id`. Secured.
*   `GET /transfers/:id`: Fetch transfer details. Secured.
*   `PUT /transfers/:id/approve`: Approve transfer request. Secured.
*   `PUT /transfers/:id/reject`: Reject transfer request. Secured.
*   `PUT /transfers/:id/complete`: Complete transfer, returning old allocation and creating a new one. Secured.

### 6. Booking (`/api`)
*   `POST /bookings`: Reserve shared bookable resource. Payload: `{ asset_id, employee_id, start_time, end_time }`. Secured.
*   `GET /bookings`: List bookings. Query filters: `status`, `asset_id`, `employee_id`. Secured.
*   `GET /bookings/:id`: Fetch booking details. Secured.
*   `PUT /bookings/:id/cancel`: Cancel booking. Secured.

### 7. Maintenance (`/api`)
*   `POST /maintenance`: Raise maintenance issue. Payload: `{ asset_id, priority, issue_description, photo_url (optional) }`. Secured.
*   `GET /maintenance`: List requests. Query filters: `status`, `priority`, `asset_id`. Secured.
*   `GET /maintenance/:id`: Fetch request details. Secured.
*   `PUT /maintenance/:id/status`: Update request status (e.g. approve, assign technician, resolve). Payload: `{ status, technician_name (optional) }`. Secured.

### 8. Audit (`/api`)
*   `POST /audit/cycles`: Schedule auditing cycle. Payload: `{ audit_name, department_id (optional), start_date, end_date, auditor_ids }`. Secured.
*   `GET /audit/cycles`: List cycles. Query filters: `status`, `department_id`. Secured.
*   `GET /audit/cycles/:id`: Fetch cycle details with records. Secured.
*   `POST /audit/records`: Submit audit verification. Payload: `{ audit_cycle_id, asset_id, verification_status, remarks (optional) }`. Secured.
*   `GET /audit/records`: List verification records. Query filters: `audit_cycle_id`, `verification_status`. Secured.

### 9. Notifications (`/api`)
*   `GET /notifications`: Fetch user alerts. Query parameters: `is_read`. Secured.
*   `PUT /notifications/:id/read`: Mark notification as read. Secured.

### 10. Reports (`/api`)
*   `GET /reports/assets`: Generate asset list report. Query parameters: `category_id`, `condition`, `status`. Secured.
*   `GET /reports/allocations`: Generate checkout logs report. Query parameters: `employee_id`, `status`, `start_date`, `end_date`. Secured.
*   `GET /reports/maintenance`: Generate maintenance orders report. Query parameters: `status`, `priority`. Secured.
*   `GET /reports/audits`: Generate audit verification report. Query parameters: `audit_cycle_id`, `verification_status`. Secured.

### 11. Dashboard (`/api`)
*   `GET /dashboard/stats`: Returns analytics counters, category summaries, department active allocation counts, and recent notifications. Secured.

---

## 3. Frontend Integration Guidelines

### 1. Bearer Token Authorization
For all secured routes, attach the active access JWT token to the `Authorization` request header:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Automatically inject Access Token into request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. Standard Axios Error Interceptor
Handle token expirations (HTTP `401 Unauthorized`) globally:
```javascript
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // Auto-logout user on expired/invalid credentials
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error.response?.data || error.message);
  }
);
```

### 3. Handling Custom Error Payloads
For form validations (HTTP `400 Bad Request`), retrieve the custom `errors` array:
```javascript
try {
  await api.post('/auth/register', signupForm);
} catch (err) {
  if (err.errors) {
    // Array of string errors from validator
    err.errors.forEach(validationError => {
      showToastNotification(validationError);
    });
  } else {
    showToastNotification(err.message || 'Signup failed');
  }
}
```
