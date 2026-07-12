-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "AssetCondition" AS ENUM ('NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED');

-- CreateEnum
CREATE TYPE "AllocationStatus" AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'TRANSFERRED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MaintenancePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AuditCycleStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'MISSING', 'DAMAGED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ASSET_ASSIGNED', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'BOOKING_REMINDER', 'MAINTENANCE_APPROVED', 'MAINTENANCE_REJECTED', 'TRANSFER_APPROVED', 'OVERDUE_RETURN', 'AUDIT_DISCREPANCY');

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" "UserRole" NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "departments" (
    "department_id" SERIAL NOT NULL,
    "department_name" VARCHAR(150) NOT NULL,
    "parent_department_id" INTEGER,
    "department_head_id" INTEGER,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "employee_code" VARCHAR(30) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "department_id" INTEGER,
    "role_id" INTEGER NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "asset_categories" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "warranty_period" INTEGER,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "asset_categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "assets" (
    "asset_id" SERIAL NOT NULL,
    "asset_tag" VARCHAR(30) NOT NULL,
    "asset_name" VARCHAR(150) NOT NULL,
    "serial_number" VARCHAR(100) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "purchase_date" DATE,
    "purchase_cost" DECIMAL(10,2),
    "condition" "AssetCondition" NOT NULL,
    "status" "AssetStatus" NOT NULL,
    "location" VARCHAR(150),
    "is_bookable" BOOLEAN NOT NULL DEFAULT false,
    "photo_url" TEXT,
    "created_by" INTEGER,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("asset_id")
);

-- CreateTable
CREATE TABLE "asset_allocations" (
    "allocation_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "allocated_by" INTEGER NOT NULL,
    "allocation_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expected_return_date" DATE,
    "actual_return_date" DATE,
    "status" "AllocationStatus" NOT NULL,
    "checkin_notes" TEXT,

    CONSTRAINT "asset_allocations_pkey" PRIMARY KEY ("allocation_id")
);

-- CreateTable
CREATE TABLE "asset_transfers" (
    "transfer_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "from_employee" INTEGER,
    "to_employee" INTEGER NOT NULL,
    "requested_by" INTEGER NOT NULL,
    "approved_by" INTEGER,
    "status" "TransferStatus" NOT NULL,
    "requested_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP,

    CONSTRAINT "asset_transfers_pkey" PRIMARY KEY ("transfer_id")
);

-- CreateTable
CREATE TABLE "resource_bookings" (
    "booking_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "department_id" INTEGER,
    "start_time" TIMESTAMP NOT NULL,
    "end_time" TIMESTAMP NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "maintenance_requests" (
    "maintenance_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "raised_by" INTEGER NOT NULL,
    "approved_by" INTEGER,
    "priority" "MaintenancePriority" NOT NULL,
    "issue_description" TEXT NOT NULL,
    "photo_url" TEXT,
    "status" "MaintenanceStatus" NOT NULL,
    "technician_name" VARCHAR(150),
    "started_at" TIMESTAMP,
    "completed_at" TIMESTAMP,

    CONSTRAINT "maintenance_requests_pkey" PRIMARY KEY ("maintenance_id")
);

-- CreateTable
CREATE TABLE "audit_cycles" (
    "audit_cycle_id" SERIAL NOT NULL,
    "audit_name" VARCHAR(150) NOT NULL,
    "department_id" INTEGER,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "created_by" INTEGER NOT NULL,
    "status" "AuditCycleStatus" NOT NULL,

    CONSTRAINT "audit_cycles_pkey" PRIMARY KEY ("audit_cycle_id")
);

-- CreateTable
CREATE TABLE "audit_cycle_auditors" (
    "audit_cycle_id" INTEGER NOT NULL,
    "auditor_id" INTEGER NOT NULL,

    CONSTRAINT "audit_cycle_auditors_pkey" PRIMARY KEY ("audit_cycle_id","auditor_id")
);

-- CreateTable
CREATE TABLE "audit_records" (
    "record_id" SERIAL NOT NULL,
    "audit_cycle_id" INTEGER NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "auditor_id" INTEGER NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL,
    "remarks" TEXT,
    "verified_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_records_pkey" PRIMARY KEY ("record_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "log_id" BIGSERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(150) NOT NULL,
    "module" VARCHAR(50) NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_department_name_key" ON "departments"("department_name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_department_head_id_key" ON "departments"("department_head_id");

-- CreateIndex
CREATE INDEX "departments_parent_department_id_idx" ON "departments"("parent_department_id");

-- CreateIndex
CREATE INDEX "departments_department_head_id_idx" ON "departments"("department_head_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_employee_code_key" ON "users"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_department_id_idx" ON "users"("department_id");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_categories_category_name_key" ON "asset_categories"("category_name");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "assets_asset_tag_key" ON "assets"("asset_tag");

-- CreateIndex
CREATE UNIQUE INDEX "assets_serial_number_key" ON "assets"("serial_number");

-- CreateIndex
CREATE INDEX "assets_category_id_idx" ON "assets"("category_id");

-- CreateIndex
CREATE INDEX "assets_created_by_idx" ON "assets"("created_by");

-- CreateIndex
CREATE INDEX "assets_status_idx" ON "assets"("status");

-- CreateIndex
CREATE INDEX "asset_allocations_asset_id_idx" ON "asset_allocations"("asset_id");

-- CreateIndex
CREATE INDEX "asset_allocations_employee_id_idx" ON "asset_allocations"("employee_id");

-- CreateIndex
CREATE INDEX "asset_allocations_allocated_by_idx" ON "asset_allocations"("allocated_by");

-- CreateIndex
CREATE INDEX "asset_allocations_status_idx" ON "asset_allocations"("status");

-- CreateIndex
CREATE INDEX "asset_transfers_asset_id_idx" ON "asset_transfers"("asset_id");

-- CreateIndex
CREATE INDEX "asset_transfers_from_employee_idx" ON "asset_transfers"("from_employee");

-- CreateIndex
CREATE INDEX "asset_transfers_to_employee_idx" ON "asset_transfers"("to_employee");

-- CreateIndex
CREATE INDEX "asset_transfers_status_idx" ON "asset_transfers"("status");

-- CreateIndex
CREATE INDEX "resource_bookings_asset_id_idx" ON "resource_bookings"("asset_id");

-- CreateIndex
CREATE INDEX "resource_bookings_employee_id_idx" ON "resource_bookings"("employee_id");

-- CreateIndex
CREATE INDEX "resource_bookings_department_id_idx" ON "resource_bookings"("department_id");

-- CreateIndex
CREATE INDEX "resource_bookings_start_time_end_time_idx" ON "resource_bookings"("start_time", "end_time");

-- CreateIndex
CREATE INDEX "maintenance_requests_asset_id_idx" ON "maintenance_requests"("asset_id");

-- CreateIndex
CREATE INDEX "maintenance_requests_raised_by_idx" ON "maintenance_requests"("raised_by");

-- CreateIndex
CREATE INDEX "maintenance_requests_approved_by_idx" ON "maintenance_requests"("approved_by");

-- CreateIndex
CREATE INDEX "maintenance_requests_status_idx" ON "maintenance_requests"("status");

-- CreateIndex
CREATE INDEX "audit_cycles_department_id_idx" ON "audit_cycles"("department_id");

-- CreateIndex
CREATE INDEX "audit_cycles_created_by_idx" ON "audit_cycles"("created_by");

-- CreateIndex
CREATE INDEX "audit_cycles_status_idx" ON "audit_cycles"("status");

-- CreateIndex
CREATE INDEX "audit_records_audit_cycle_id_idx" ON "audit_records"("audit_cycle_id");

-- CreateIndex
CREATE INDEX "audit_records_asset_id_idx" ON "audit_records"("asset_id");

-- CreateIndex
CREATE INDEX "audit_records_auditor_id_idx" ON "audit_records"("auditor_id");

-- CreateIndex
CREATE UNIQUE INDEX "audit_records_audit_cycle_id_asset_id_key" ON "audit_records"("audit_cycle_id", "asset_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "activity_logs_module_idx" ON "activity_logs"("module");

-- CreateIndex
CREATE INDEX "activity_logs_entity_id_idx" ON "activity_logs"("entity_id");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_department_head_id_fkey" FOREIGN KEY ("department_head_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "asset_categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_allocations" ADD CONSTRAINT "asset_allocations_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_allocations" ADD CONSTRAINT "asset_allocations_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_allocations" ADD CONSTRAINT "asset_allocations_allocated_by_fkey" FOREIGN KEY ("allocated_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_transfers" ADD CONSTRAINT "asset_transfers_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_transfers" ADD CONSTRAINT "asset_transfers_from_employee_fkey" FOREIGN KEY ("from_employee") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_transfers" ADD CONSTRAINT "asset_transfers_to_employee_fkey" FOREIGN KEY ("to_employee") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_transfers" ADD CONSTRAINT "asset_transfers_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_transfers" ADD CONSTRAINT "asset_transfers_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_bookings" ADD CONSTRAINT "resource_bookings_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_bookings" ADD CONSTRAINT "resource_bookings_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_bookings" ADD CONSTRAINT "resource_bookings_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_raised_by_fkey" FOREIGN KEY ("raised_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_cycles" ADD CONSTRAINT "audit_cycles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_cycles" ADD CONSTRAINT "audit_cycles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_cycle_auditors" ADD CONSTRAINT "audit_cycle_auditors_audit_cycle_id_fkey" FOREIGN KEY ("audit_cycle_id") REFERENCES "audit_cycles"("audit_cycle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_cycle_auditors" ADD CONSTRAINT "audit_cycle_auditors_auditor_id_fkey" FOREIGN KEY ("auditor_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_records" ADD CONSTRAINT "audit_records_audit_cycle_id_fkey" FOREIGN KEY ("audit_cycle_id") REFERENCES "audit_cycles"("audit_cycle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_records" ADD CONSTRAINT "audit_records_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_records" ADD CONSTRAINT "audit_records_auditor_id_fkey" FOREIGN KEY ("auditor_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
