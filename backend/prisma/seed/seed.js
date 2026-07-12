require('dotenv').config();
const prisma = require('../../src/config/db');

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
  for (const role of rolesData) {
    await prisma.role.upsert({
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
  for (const dept of departmentsData) {
    await prisma.department.upsert({
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
