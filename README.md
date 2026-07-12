<img width="3353" height="2742" alt="image" src="https://github.com/user-attachments/assets/da054073-7910-493d-ace9-943f08024f88" />#  ProjectOdoo

## Enterprise Asset & Resource Management System

An enterprise-grade Asset & Resource Management System developed as part of the **ProjectOdoo Hiring Hackathon**.

The platform aims to help organizations efficiently manage assets, track resource allocation, monitor asset lifecycle, and improve operational visibility through a centralized dashboard.

##  Team

| Name | Role |
|------|------|
| Sahith Akula | Solution Architect and Backend Engineer |
| Pandu Ranga | Frontend Engineer & User Interface Designer |
| Manoj Kumar | Backend Engineer and Database Design role |
| Ratnakar | Frontend Engineer | 

# 🛠️ Tech Stack

AssetFlow is built using a modern full-stack architecture designed for scalability, modularity, and maintainability.

| Layer | Technology |
|--------|------------|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Authentication | JWT, bcrypt |
| Authorization | Role-Based Access Control (RBAC) |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| API | REST API |
| Version Control | Git & GitHub |
| Deployment | Vercel (Frontend), Render (Backend) |

# 🏗️ Enterprise System Architecture

The AssetFlow platform follows a layered enterprise architecture to ensure separation of concerns, scalability, and maintainability.

The architecture is divided into six logical layers:

- **User Layer** – Admin, Asset Manager, Department Head, and Employees interact with the system through a web browser.
- **Client Layer** – A React.js frontend provides dedicated modules such as Authentication, Dashboard, Asset Management, Maintenance, Audit, Reports, and Notifications.
- **Backend Layer** – Express.js exposes secure REST APIs protected using JWT Authentication and Role-Based Access Control (RBAC).
- **Business Layer** – Core business logic is separated into independent modules including Assets, Bookings, Maintenance, Transfers, Audits, Notifications, and Reports.
- **Data Access Layer** – Prisma ORM abstracts database operations using the Repository Pattern.
- **Database Layer** – PostgreSQL stores all enterprise data including users, departments, assets, bookings, maintenance records, audit logs, and reports.

This layered architecture improves modularity, security, and future scalability.
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/0072e050-3568-4f1d-8e7b-ca66bcd95b70" />

# ⚙️ Backend Modular Architecture

The backend follows a modular architecture where every business domain is isolated into its own service module.

The request lifecycle follows:

Client Request
→ Express API Server
→ Middleware Layer
→ Business Module
→ Repository Layer
→ Prisma ORM
→ PostgreSQL

The middleware layer is responsible for:

- JWT Authentication
- Role-Based Authorization (RBAC)
- Request Validation
- Logging
- Exception Handling

Business functionality is divided into dedicated modules:

- Authentication
- Organization Management
- Asset Management
- Allocation & Transfer
- Resource Booking
- Maintenance Management
- Audit Management
- Dashboard & Analytics
- Notification & Activity Logging

Each module communicates with the Repository Layer through Prisma ORM while important business events generate notifications and activity logs.

<img width="1600" height="872" alt="image" src="https://github.com/user-attachments/assets/35f87fb5-c7b9-468d-b9e4-2e9893a46d3a" />

# 🔄 Business Workflow Architecture

The business workflow illustrates the complete lifecycle of an enterprise asset from registration until retirement.

The workflow consists of the following stages:

1. Administrator configures departments, asset categories, employees, and user roles.
2. Asset Managers register organizational assets.
3. Newly registered assets become available for allocation.
4. Employees receive assets based on organizational requirements.
5. Employees can:
   - Use allocated assets
   - Book shared resources
   - Raise maintenance requests
   - Request transfers
   - Initiate returns
6. Maintenance requests follow an approval workflow before repair activities begin.
7. Transfer requests require approvals from Department Heads and Asset Managers.
8. Returned assets undergo condition inspection before becoming available again.
9. Periodic audit cycles verify all organizational assets.
10. Dashboard analytics, reports, notifications, and activity logs are automatically updated throughout every stage.

A centralized Notification Engine continuously tracks business events and keeps all stakeholders informed in real time.

<img width="1024" height="1536" alt="image" src="https://github.com/user-attachments/assets/ac073cf1-e6ec-47f3-8624-89c00636156c" />

## 🗃️ Database Design

PostgreSQL was chosen for strong ACID transactions, robust foreign key support, JSON field support, and enterprise-grade indexing/scalability.

The schema is organized into 6 business modules and 15 tables:

- **Authentication** — roles, users, sessions
- **Organization** — departments, asset_categories
- **Asset** — assets, asset_allocations, asset_transfers
- **Booking** — resource_bookings
- **Maintenance** — maintenance_requests
- **Audit** — audit_cycles, audit_cycle_auditors, audit_records
- **Notification** — notifications, activity_logs

Key business rules enforced at the database level:
- One asset can have many allocation records, but only **one active allocation** at a time (no double-allocation).
- One asset **cannot have overlapping bookings** — enforced as a table-level time-range exclusion constraint.
- Only assets flagged `is_bookable` can be booked.
- Asset status transitions automatically based on allocation/maintenance events (e.g. `AVAILABLE → UNDER_MAINTENANCE` on maintenance approval).
- One department has exactly one Department Head.
- Every maintenance request, transfer, and audit record belongs to exactly one asset/cycle.
- Every critical action is written to `activity_logs`.

<img width="3353" height="2742" alt="image" src="https://github.com/user-attachments/assets/d61ad959-99c9-4e81-b64b-eb489700844f" />







