require('dotenv').config();
const prisma = require('../../src/config/db');
const bcrypt = require('bcrypt');

async function main() {
  console.log('Seeding database...');

  // 1. Seed Roles
  const rolesData = [
    { role_name: 'ADMIN', description: 'Administrator with full system access' },
    { role_name: 'ASSET_MANAGER', description: 'Manager responsible for asset tracking and operations' },
    { role_name: 'DEPARTMENT_HEAD', description: 'Head of department responsible for approvals' },
    { role_name: 'EMPLOYEE', description: 'Standard employee user' }
  ];

  console.log('Inserting Roles...');
  const roles = {};
  for (const role of rolesData) {
    roles[role.role_name] = await prisma.role.upsert({
      where: { role_name: role.role_name },
      update: { description: role.description },
      create: role,
    });
  }

  // 2. Seed Departments
  const departmentsData = [
    { department_name: 'Engineering', status: 'ACTIVE' },
    { department_name: 'Human Resources', status: 'ACTIVE' },
    { department_name: 'Finance', status: 'ACTIVE' },
    { department_name: 'Operations', status: 'ACTIVE' },
    { department_name: 'Sales', status: 'ACTIVE' }
  ];

  console.log('Inserting Departments...');
  const depts = {};
  for (const dept of departmentsData) {
    depts[dept.department_name] = await prisma.department.upsert({
      where: { department_name: dept.department_name },
      update: { status: dept.status },
      create: dept,
    });
  }

  // 3. Seed Asset Categories
  const categoriesData = [
    { category_name: 'Laptops', description: 'Workstations and portable computers', warranty_period: 36, status: 'ACTIVE' },
    { category_name: 'Monitors', description: 'External displays and screens', warranty_period: 24, status: 'ACTIVE' },
    { category_name: 'Printers', description: 'Office printers, scanners, and copiers', warranty_period: 12, status: 'ACTIVE' },
    { category_name: 'Projectors', description: 'Meeting room projectors and presentation hardware', warranty_period: 24, status: 'ACTIVE' },
    { category_name: 'Vehicles', description: 'Company cars and transport vehicles', warranty_period: 60, status: 'ACTIVE' },
    { category_name: 'Furniture', description: 'Desks, chairs, filing cabinets, and office furniture', warranty_period: 120, status: 'ACTIVE' }
  ];

  console.log('Inserting Asset Categories...');
  for (const cat of categoriesData) {
    await prisma.assetCategory.upsert({
      where: { category_name: cat.category_name },
      update: {
        description: cat.description,
        warranty_period: cat.warranty_period,
        status: cat.status
      },
      create: cat,
    });
  }

  // 4. Seed Demo Users
  console.log('Inserting Demo Users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const demoUsers = [
    {
      employee_code: 'EMP001',
      full_name: 'Pandu',
      email: 'pandu@assetflow.com',
      password_hash: passwordHash,
      role_id: roles['ASSET_MANAGER'].role_id,
      department_id: depts['Engineering'].department_id,
      status: 'ACTIVE'
    },
    {
      employee_code: 'EMP002',
      full_name: 'Rahul',
      email: 'rahul@assetflow.com',
      password_hash: passwordHash,
      role_id: roles['ADMIN'].role_id,
      department_id: depts['Operations'].department_id, // IT/Operations
      status: 'ACTIVE'
    },
    {
      employee_code: 'EMP003',
      full_name: 'Sarah Chen',
      email: 'sarah.c@assetflow.com',
      password_hash: passwordHash,
      role_id: roles['DEPARTMENT_HEAD'].role_id,
      department_id: depts['Human Resources'].department_id,
      status: 'ACTIVE'
    },
    {
      employee_code: 'EMP005',
      full_name: 'Alice Watson',
      email: 'alice.w@assetflow.com',
      password_hash: passwordHash,
      role_id: roles['EMPLOYEE'].role_id,
      department_id: depts['Sales'].department_id,
      status: 'ACTIVE'
    }
  ];

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        employee_code: user.employee_code,
        full_name: user.full_name,
        password_hash: user.password_hash,
        role_id: user.role_id,
        department_id: user.department_id,
        status: user.status
      },
      create: user
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (prisma.pool) {
      await prisma.pool.end();
    }
  });
