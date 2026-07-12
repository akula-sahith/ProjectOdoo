import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AppContext = createContext();

const initialDepartments = [
  { code: 'ENG', name: 'Engineering', head: 'EMP001', employeesCount: 18, assetsCount: 45, status: 'Active', phone: '+1-555-0101', email: 'eng@assetflow.com', description: 'Software and Hardware development team.' },
  { code: 'IT', name: 'Information Technology', head: 'EMP002', employeesCount: 8, assetsCount: 120, status: 'Active', phone: '+1-555-0102', email: 'it@assetflow.com', description: 'Core infrastructure, security, and helpdesk.' },
  { code: 'HR', name: 'Human Resources', head: 'EMP003', employeesCount: 5, assetsCount: 15, status: 'Active', phone: '+1-555-0103', email: 'hr@assetflow.com', description: 'Talent acquisition, operations, and benefits.' },
  { code: 'FIN', name: 'Finance', head: 'EMP004', employeesCount: 4, assetsCount: 22, status: 'Active', phone: '+1-555-0104', email: 'finance@assetflow.com', description: 'Corporate accounting, budgeting, and audits.' },
  { code: 'MKT', name: 'Marketing', head: 'EMP005', employeesCount: 12, assetsCount: 28, status: 'Active', phone: '+1-555-0105', email: 'mkt@assetflow.com', description: 'Brand strategy, design, and growth marketing.' },
];

const initialCategories = [
  { code: 'LAP', name: 'Laptops', description: 'Developer and business portable computers.', warrantyRequired: true, maintenanceCycle: 12, assetLifetime: 4, status: 'Active' },
  { code: 'FUR', name: 'Furniture & Desks', description: 'Office desks, chairs, and conference setups.', warrantyRequired: false, maintenanceCycle: 24, assetLifetime: 10, status: 'Active' },
  { code: 'VEH', name: 'Vehicles', description: 'Company cars, vans, and utility vehicles.', warrantyRequired: true, maintenanceCycle: 6, assetLifetime: 8, status: 'Active' },
  { code: 'MTE', name: 'Meeting Room Equipment', description: 'Projectors, display screens, and smart polycoms.', warrantyRequired: true, maintenanceCycle: 6, assetLifetime: 5, status: 'Active' },
  { code: 'SRV', name: 'Servers & Hosting', description: 'High-performance physical rack and stack servers.', warrantyRequired: true, maintenanceCycle: 3, assetLifetime: 5, status: 'Active' },
  { code: 'NET', name: 'Networking Devices', description: 'Switches, routers, and firewalls.', warrantyRequired: true, maintenanceCycle: 12, assetLifetime: 5, status: 'Active' },
  { code: 'SMD', name: 'Smart Devices', description: 'iPads, testing mobiles, and tablets.', warrantyRequired: true, maintenanceCycle: 12, assetLifetime: 3, status: 'Active' },
];

const initialEmployees = [
  { id: 'EMP001', name: 'Pandu', email: 'pandu@assetflow.com', phone: '+1-555-1001', department: 'ENG', designation: 'Asset Manager', role: 'Asset Manager', status: 'Active', joiningDate: '2022-04-12', manager: 'Mark Davis', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
  { id: 'EMP002', name: 'Rahul', email: 'rahul@assetflow.com', phone: '+1-555-1002', department: 'IT', designation: 'System Administrator', role: 'Admin', status: 'Active', joiningDate: '2021-08-15', manager: 'Mark Davis', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
  { id: 'EMP003', name: 'Sarah Chen', email: 'sarah.c@assetflow.com', phone: '+1-555-1003', department: 'HR', designation: 'HR Director', role: 'Department Head', status: 'Active', joiningDate: '2020-03-10', manager: 'CEO', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120' },
  { id: 'EMP004', name: 'Mark Davis', email: 'mark.d@assetflow.com', phone: '+1-555-1004', department: 'FIN', designation: 'CFO', role: 'Department Head', status: 'Active', joiningDate: '2019-11-22', manager: 'CEO', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' },
  { id: 'EMP005', name: 'Alice Watson', email: 'alice.w@assetflow.com', phone: '+1-555-1005', department: 'MKT', designation: 'Creative Lead', role: 'Employee', status: 'Active', joiningDate: '2023-02-14', manager: 'Sarah Chen', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120' },
];

const initialAssets = [
  { tag: 'AF-1001', name: 'MacBook Pro 16"', category: 'LAP', assignedTo: 'EMP001', status: 'Allocated', condition: 'Excellent', purchaseCost: 2499, location: 'HQ-Floor 3-Rm 302', purchaseDate: '2025-03-10', warrantyStart: '2025-03-10', warrantyEnd: '2028-03-10', serial: 'SN-92837492', brand: 'Apple', model: 'MacBook Pro M4', description: 'Developer machine with 32GB RAM, 1TB SSD.', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200', shared: false, allocationCount: 1, maintenanceCount: 1, lastAudit: '2026-06-15' },
  { tag: 'AF-1002', name: 'Dell XPS 15', category: 'LAP', assignedTo: 'EMP005', status: 'Allocated', condition: 'Good', purchaseCost: 1899, location: 'HQ-Floor 2-Rm 215', purchaseDate: '2025-06-15', warrantyStart: '2025-06-15', warrantyEnd: '2028-06-15', serial: 'SN-12398471', brand: 'Dell', model: 'XPS 9530', description: 'Creative designer laptop, Intel i7, 16GB RAM.', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=200', shared: false, allocationCount: 2, maintenanceCount: 2, lastAudit: '2026-06-15' },
  { tag: 'AF-1003', name: 'Ergonomic Aeron Chair', category: 'FUR', assignedTo: 'EMP001', status: 'Allocated', condition: 'Excellent', purchaseCost: 1450, location: 'HQ-Floor 3-Rm 302', purchaseDate: '2024-01-20', warrantyStart: '2024-01-20', warrantyEnd: '2036-01-20', serial: 'SN-CH-9102', brand: 'Herman Miller', model: 'Aeron Size B', description: 'Fully adjustable ergonomic mesh chair.', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=200', shared: false, allocationCount: 1, maintenanceCount: 0, lastAudit: '2026-06-15' },
  { tag: 'AF-1004', name: '4K Smart Projector', category: 'MTE', assignedTo: null, status: 'Available', condition: 'Good', purchaseCost: 850, location: 'HQ-Floor 1-Conf Room A', purchaseDate: '2025-01-15', warrantyStart: '2025-01-15', warrantyEnd: '2027-01-15', serial: 'SN-PR-0091', brand: 'Epson', model: 'EX-9240', description: 'Portable meeting room high lumen projector.', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=200', shared: true, allocationCount: 5, maintenanceCount: 1, lastAudit: '2026-06-15' },
  { tag: 'AF-1005', name: 'Tesla Model 3 (Company Vehicle)', category: 'VEH', assignedTo: 'EMP004', status: 'Allocated', condition: 'Excellent', purchaseCost: 45000, location: 'Main Parking Lot', purchaseDate: '2024-08-12', warrantyStart: '2024-08-12', warrantyEnd: '2028-08-12', serial: 'SN-VIN-8823', brand: 'Tesla', model: 'Model 3 LR', description: 'C-Suite executive transport and regional visits.', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=200', shared: true, allocationCount: 3, maintenanceCount: 0, lastAudit: '2026-06-15' },
  { tag: 'AF-1006', name: 'Rack Server PowerEdge', category: 'SRV', assignedTo: null, status: 'Maintenance', condition: 'Fair', purchaseCost: 12000, location: 'Server Room 1A', purchaseDate: '2023-11-05', warrantyStart: '2023-11-05', warrantyEnd: '2026-11-05', serial: 'SN-SRV-9921', brand: 'Dell', model: 'PowerEdge R750', description: 'Virtualization host, 128GB RAM, dual Xeon.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=200', shared: false, allocationCount: 1, maintenanceCount: 3, lastAudit: '2026-06-15' },
  { tag: 'AF-1007', name: 'Cisco Enterprise Router', category: 'NET', assignedTo: null, status: 'Available', condition: 'Good', purchaseCost: 4200, location: 'Server Room 1A', purchaseDate: '2024-04-10', warrantyStart: '2024-04-10', warrantyEnd: '2029-04-10', serial: 'SN-NET-7711', brand: 'Cisco', model: 'Catalyst 8300', description: 'Core router for WAN and local mesh.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=200', shared: false, allocationCount: 1, maintenanceCount: 0, lastAudit: '2026-06-15' },
  { tag: 'AF-1008', name: 'iPad Pro 12.9"', category: 'SMD', assignedTo: 'EMP003', status: 'Allocated', condition: 'Good', purchaseCost: 1099, location: 'HQ-Floor 2-HR Dept', purchaseDate: '2025-05-18', warrantyStart: '2025-05-18', warrantyEnd: '2027-05-18', serial: 'SN-TAB-4829', brand: 'Apple', model: 'iPad Pro M2', description: 'HR director paperless signing and meeting companion.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=200', shared: false, allocationCount: 1, maintenanceCount: 0, lastAudit: '2026-06-15' },
  { tag: 'AF-1009', name: 'Conference Table', category: 'FUR', assignedTo: null, status: 'Available', condition: 'Good', purchaseCost: 3200, location: 'HQ-Floor 1-Conf Room B', purchaseDate: '2023-02-14', warrantyStart: '2023-02-14', warrantyEnd: '2023-02-14', serial: 'SN-CH-0041', brand: 'Steelcase', model: 'Verlay Wood', description: '10-person solid wood modular boardroom table.', image: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?auto=format&fit=crop&q=80&w=200', shared: true, allocationCount: 0, maintenanceCount: 0, lastAudit: '2026-06-15' },
  { tag: 'AF-1010', name: 'ThinkPad X1 Carbon', category: 'LAP', assignedTo: null, status: 'Lost', condition: 'Good', purchaseCost: 1699, location: 'HQ-Floor 3-Rm 304', purchaseDate: '2024-10-05', warrantyStart: '2024-10-05', warrantyEnd: '2027-10-05', serial: 'SN-LP-7763', brand: 'Lenovo', model: 'X1 Carbon Gen 11', description: 'Ultra-light executive laptop. Reported missing.', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=200', shared: false, allocationCount: 1, maintenanceCount: 1, lastAudit: '2026-06-15' },
  { tag: 'AF-1011', name: 'HP LaserJet Enterprise', category: 'MTE', assignedTo: null, status: 'Maintenance', condition: 'Poor', purchaseCost: 1500, location: 'HQ-Floor 2-Mailroom', purchaseDate: '2023-07-22', warrantyStart: '2023-07-22', warrantyEnd: '2024-07-22', serial: 'SN-PRN-3342', brand: 'HP', model: 'LaserJet M608', description: 'High-speed office workgroup printer.', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=200', shared: true, allocationCount: 4, maintenanceCount: 4, lastAudit: '2026-06-15' },
  { tag: 'AF-1012', name: 'Apple Studio Display', category: 'SMD', assignedTo: 'EMP001', status: 'Allocated', condition: 'Excellent', purchaseCost: 1599, location: 'HQ-Floor 3-Rm 302', purchaseDate: '2025-04-01', warrantyStart: '2025-04-01', warrantyEnd: '2028-04-01', serial: 'SN-DSP-1192', brand: 'Apple', model: 'Studio Display 5K', description: 'High-resolution workstation monitor.', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=200', shared: false, allocationCount: 1, maintenanceCount: 0, lastAudit: '2026-06-15' },
  { tag: 'AF-1013', name: 'Executive Desk Wood', category: 'FUR', assignedTo: 'EMP004', status: 'Allocated', condition: 'Good', purchaseCost: 2200, location: 'HQ-Floor 4-C-Suite', purchaseDate: '2023-09-18', warrantyStart: '2023-09-18', warrantyEnd: '2023-09-18', serial: 'SN-DSK-4451', brand: 'Knoll', model: 'Florence Table Desk', description: 'Mahogany finished modern executive desk.', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=200', shared: false, allocationCount: 1, maintenanceCount: 0, lastAudit: '2026-06-15' },
  { tag: 'AF-1014', name: 'Conference Phone Polycom', category: 'MTE', assignedTo: null, status: 'Available', condition: 'Good', purchaseCost: 450, location: 'HQ-Floor 3-Rm 310', purchaseDate: '2024-11-12', warrantyStart: '2024-11-12', warrantyEnd: '2026-11-12', serial: 'SN-PHN-2281', brand: 'Poly', model: 'Trio 8800', description: 'Smart conference phone for larger rooms.', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=200', shared: true, allocationCount: 2, maintenanceCount: 1, lastAudit: '2026-06-15' },
  { tag: 'AF-1015', name: 'Ford Transit Cargo Van', category: 'VEH', assignedTo: null, status: 'Disposed', condition: 'Poor', purchaseCost: 38000, location: 'Offsite Storage', purchaseDate: '2019-02-10', warrantyStart: '2019-02-10', warrantyEnd: '2022-02-10', serial: 'SN-VAN-4411', brand: 'Ford', model: 'Transit 250', description: 'Logistics cargo van. Retired from active fleet.', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=200', shared: false, allocationCount: 4, maintenanceCount: 5, lastAudit: '2026-06-15' }
];

const initialBookings = [
  { id: 'BKG001', assetTag: 'AF-1004', assetName: '4K Smart Projector', employeeId: 'EMP001', employeeName: 'Pandu', purpose: 'Q3 Product Strategy Sync', startTime: '2026-07-15T10:00', endTime: '2026-07-15T12:00', status: 'Approved', conflictDetected: false },
  { id: 'BKG002', assetTag: 'AF-1005', assetName: 'Tesla Model 3 (Company Vehicle)', employeeId: 'EMP004', employeeName: 'Mark Davis', purpose: 'Quarterly Audit Committee Travel', startTime: '2026-07-16T08:00', endTime: '2026-07-16T18:00', status: 'Approved', conflictDetected: false },
  { id: 'BKG003', assetTag: 'AF-1004', assetName: '4K Smart Projector', employeeId: 'EMP005', employeeName: 'Alice Watson', purpose: 'Creative Marketing Brainstorm', startTime: '2026-07-15T13:00', endTime: '2026-07-15T15:00', status: 'Approved', conflictDetected: false },
  { id: 'BKG004', assetTag: 'AF-1014', assetName: 'Conference Phone Polycom', employeeId: 'EMP003', employeeName: 'Sarah Chen', purpose: 'Board Executive Recruiting Call', startTime: '2026-07-17T11:00', endTime: '2026-07-17T12:30', status: 'Pending', conflictDetected: false },
];

const initialMaintenanceTickets = [
  { id: 'MNT001', assetTag: 'AF-1006', assetName: 'Rack Server PowerEdge', issue: 'Cooling fan failure and high temperature alerts.', technician: 'Alex Mercer (IT Tech)', status: 'In Progress', priority: 'High', dueDate: '2026-07-14', createdDate: '2026-07-10', notes: 'Fans are being replaced; server thermal paste re-applied.' },
  { id: 'MNT002', assetTag: 'AF-1011', assetName: 'HP LaserJet Enterprise', issue: 'Repeated paper jam in Tray 2, grinding noises.', technician: 'Brenda Jones (Office Systems)', status: 'Pending', priority: 'Medium', dueDate: '2026-07-18', createdDate: '2026-07-11', notes: 'Scheduled for vendor visit on Thursday.' },
  { id: 'MNT003', assetTag: 'AF-1002', assetName: 'Dell XPS 15', issue: 'Battery swollen. Back cover bulging.', technician: 'Alex Mercer (IT Tech)', status: 'Approved', priority: 'High', dueDate: '2026-07-15', createdDate: '2026-07-12', notes: 'Instructed employee to stop using laptop. Replacement battery ordered.' },
  { id: 'MNT004', assetTag: 'AF-1001', assetName: 'MacBook Pro 16"', issue: 'Routine OS updates and diagnostic cleaning.', technician: 'Self (Assigned Manager)', status: 'Resolved', priority: 'Low', dueDate: '2026-07-09', createdDate: '2026-07-08', notes: 'Diagnostic check passed, laptop dust cleared.' },
];

const initialAuditItems = [
  { assetTag: 'AF-1001', assetName: 'MacBook Pro 16"', category: 'Laptops', location: 'HQ-Floor 3-Rm 302', expectedAssignee: 'Pandu', condition: 'Excellent', status: 'Verified', notes: 'Verified physically and active on network.' },
  { assetTag: 'AF-1002', assetName: 'Dell XPS 15', category: 'Laptops', location: 'HQ-Floor 2-Rm 215', expectedAssignee: 'Alice Watson', condition: 'Good', status: 'Verified', notes: 'Device checked by employee.' },
  { assetTag: 'AF-1003', assetName: 'Ergonomic Aeron Chair', category: 'Furniture & Desks', location: 'HQ-Floor 3-Rm 302', expectedAssignee: 'Pandu', condition: 'Excellent', status: 'Verified', notes: 'Cleaned and visually verified.' },
  { assetTag: 'AF-1004', assetName: '4K Smart Projector', category: 'Meeting Room Equipment', location: 'HQ-Floor 1-Conf Room A', expectedAssignee: 'Shared', condition: 'Good', status: 'Verified', notes: 'Verified in Conf Room A.' },
  { assetTag: 'AF-1005', assetName: 'Tesla Model 3 (Company Vehicle)', category: 'Vehicles', location: 'Main Parking Lot', expectedAssignee: 'Mark Davis', condition: 'Excellent', status: 'Verified', notes: 'Verified keys and physical presence.' },
  { assetTag: 'AF-1006', assetName: 'Rack Server PowerEdge', category: 'Servers & Hosting', location: 'Server Room 1A', expectedAssignee: 'Unassigned', condition: 'Fair', status: 'Damaged', notes: 'Server offline due to faulty motherboard cooling fan.' },
  { assetTag: 'AF-1007', assetName: 'Cisco Enterprise Router', category: 'Networking Devices', location: 'Server Room 1A', expectedAssignee: 'Unassigned', condition: 'Good', status: 'Pending', notes: '' },
  { assetTag: 'AF-1008', assetName: 'iPad Pro 12.9"', category: 'Smart Devices', location: 'HQ-Floor 2-HR Dept', expectedAssignee: 'Sarah Chen', condition: 'Good', status: 'Pending', notes: '' },
  { assetTag: 'AF-1009', assetName: 'Conference Table', category: 'Furniture & Desks', location: 'HQ-Floor 1-Conf Room B', expectedAssignee: 'Shared', condition: 'Good', status: 'Pending', notes: '' },
  { assetTag: 'AF-1010', assetName: 'ThinkPad X1 Carbon', category: 'Laptops', location: 'HQ-Floor 3-Rm 304', expectedAssignee: 'Unassigned', condition: 'Good', status: 'Missing', notes: 'Could not locate. Employee left company last week. Investigation ongoing.' },
];

const initialHistory = [
  { tag: 'AF-1001', type: 'Registration', title: 'Asset Registered', user: 'Admin', date: '2025-03-10', notes: 'Registered with serial SN-92837492. Condition: Excellent.' },
  { tag: 'AF-1001', type: 'Allocation', title: 'Asset Allocated', user: 'Admin', date: '2025-03-10', notes: 'Allocated to Pandu in Engineering department.' },
  { tag: 'AF-1001', type: 'Maintenance', title: 'Maintenance Ticket Resolved', user: 'Pandu', date: '2026-07-09', notes: 'Routine OS updates and diagnostic cleaning.' },
  { tag: 'AF-1002', type: 'Registration', title: 'Asset Registered', user: 'Admin', date: '2025-06-15', notes: 'Registered Dell XPS 15. Condition: Good.' },
  { tag: 'AF-1002', type: 'Allocation', title: 'Asset Allocated', user: 'Admin', date: '2025-06-16', notes: 'Allocated to Alice Watson in Marketing department.' },
  { tag: 'AF-1006', type: 'Maintenance', title: 'Maintenance Ticket Created', user: 'Rahul', date: '2026-07-10', notes: 'Cooling fan failure and high temperature alerts. Status: In Progress.' },
];

const initialNotifications = [
  { id: 'NTF001', type: 'Transfers', title: 'New Transfer Request', message: 'Alice Watson requests transfer of AF-1002 Laptop to Engineering Department.', time: '2026-07-12T09:10', read: false },
  { id: 'NTF002', type: 'Maintenance', title: 'Maintenance Approved', message: 'Ticket MNT003 for Dell XPS 15 (Swollen Battery) has been approved by Finance.', time: '2026-07-12T08:15', read: false },
  { id: 'NTF003', type: 'Bookings', title: 'Booking Conflict Resolved', message: 'Projector booking conflicts checked. 4K Projector is available for Meeting Room B.', time: '2026-07-11T16:30', read: true },
  { id: 'NTF004', type: 'Approvals', title: 'Pending Audit Review', message: 'Annual IT Audit checklist is 70% complete. 3 items pending verification.', time: '2026-07-11T09:00', read: false },
  { id: 'NTF005', type: 'Bookings', title: 'New Booking Created', message: 'Sarah Chen created a booking for Conference Phone Polycom on 17 July 2026.', time: '2026-07-12T09:25', read: false },
];

const initialProfileSettings = {
  companyName: 'AssetFlow Corp',
  companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=80',
  currency: 'USD ($)',
  timezone: 'UTC -05:00 (EST)',
  dateFormat: 'YYYY-MM-DD',
  notificationsEmail: true,
  notificationsInApp: true,
  backupSchedule: 'Weekly',
  emailServer: 'smtp.mail.assetflow.com',
  emailPort: '587'
};

const initialTransferRequests = [
  { id: 'TRF001', assetTag: 'AF-1002', assetName: 'Dell XPS 15', requesterId: 'EMP005', requesterName: 'Alice Watson', targetEmployeeId: 'EMP001', targetEmployeeName: 'Pandu', currentHolderId: 'EMP005', status: 'Pending', comments: 'Requested re-assignment of marketing laptop for dev support.', date: '2026-07-12', targetLocation: 'HQ-Floor 3-Rm 302' },
  { id: 'TRF002', assetTag: 'AF-1008', assetName: 'iPad Pro 12.9"', requesterId: 'EMP003', requesterName: 'Sarah Chen', targetEmployeeId: 'EMP005', targetEmployeeName: 'Alice Watson', currentHolderId: 'EMP003', status: 'Approved', comments: 'Transfer approved for designers to test interfaces.', date: '2026-07-11', targetLocation: 'HQ-Floor 2-Rm 215' }
];

const initialReturnRequests = [
  { id: 'RTN001', assetTag: 'AF-1003', assetName: 'Ergonomic Aeron Chair', employeeId: 'EMP001', employeeName: 'Pandu', status: 'Pending', returnCondition: 'Excellent', notes: 'Cleaning workstation, returning backup chair.', date: '2026-07-12' }
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('af_user');
    return saved ? JSON.parse(saved) : initialEmployees[0]; // Logged in as Pandu by default
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('af_departments');
    return saved ? JSON.parse(saved) : initialDepartments;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('af_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('af_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('af_assets');
    return saved ? JSON.parse(saved) : initialAssets;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('af_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState(() => {
    const saved = localStorage.getItem('af_maintenance');
    return saved ? JSON.parse(saved) : initialMaintenanceTickets;
  });

  const [auditItems, setAuditItems] = useState(() => {
    const saved = localStorage.getItem('af_audit_items');
    return saved ? JSON.parse(saved) : initialAuditItems;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('af_history');
    return saved ? JSON.parse(saved) : initialHistory;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('af_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('af_settings');
    return saved ? JSON.parse(saved) : initialProfileSettings;
  });

  const [transferRequests, setTransferRequests] = useState(() => {
    const saved = localStorage.getItem('af_transfers');
    return saved ? JSON.parse(saved) : initialTransferRequests;
  });

  const [returnRequests, setReturnRequests] = useState(() => {
    const saved = localStorage.getItem('af_returns');
    return saved ? JSON.parse(saved) : initialReturnRequests;
  });

  // Sync to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('af_user', JSON.stringify(user));
    else localStorage.removeItem('af_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('af_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('af_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('af_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('af_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('af_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('af_maintenance', JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem('af_audit_items', JSON.stringify(auditItems));
  }, [auditItems]);

  useEffect(() => {
    localStorage.setItem('af_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('af_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('af_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('af_transfers', JSON.stringify(transferRequests));
  }, [transferRequests]);

  useEffect(() => {
    localStorage.setItem('af_returns', JSON.stringify(returnRequests));
  }, [returnRequests]);

  // Auth Functions
  const login = (email, password) => {
    const found = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      return { success: true, user: found };
    }
    return { success: false, message: 'Invalid credentials. Try using default: pandu@assetflow.com' };
  };

  const logout = () => {
    setUser(null);
  };

  const switchUser = (userId) => {
    const found = employees.find(e => e.id === userId);
    if (found) {
      setUser(found);
      toast.success(`Switched role to ${found.name} (${found.role})`);
    }
  };

  // Asset Actions
  const registerAsset = (newAsset) => {
    if (assets.some(a => a.tag.toUpperCase() === newAsset.tag.toUpperCase())) {
      return { success: false, message: `Asset Tag ${newAsset.tag} already exists.` };
    }
    const asset = {
      ...newAsset,
      status: 'Available',
      assignedTo: null,
      allocationCount: 0,
      maintenanceCount: 0,
      lastAudit: 'N/A'
    };
    const updated = [asset, ...assets];
    setAssets(updated);

    // Write history
    const histItem = {
      tag: asset.tag,
      type: 'Registration',
      title: 'Asset Registered',
      user: user?.name || 'System',
      date: new Date().toISOString().split('T')[0],
      notes: `Registered brand new ${asset.name}.`
    };
    setHistory([histItem, ...history]);

    // Push notification
    addSystemNotification('Transfers', 'Asset Registered', `${asset.name} (${asset.tag}) was added to the inventory.`);
    return { success: true, asset };
  };

  const updateAsset = (tag, updatedAsset) => {
    const updated = assets.map(a => a.tag === tag ? { ...a, ...updatedAsset } : a);
    setAssets(updated);
    
    const histItem = {
      tag,
      type: 'Update',
      title: 'Asset Metadata Updated',
      user: user?.name || 'System',
      date: new Date().toISOString().split('T')[0],
      notes: 'Asset profile information updated.'
    };
    setHistory([histItem, ...history]);
    return { success: true };
  };

  const deleteAsset = (tag) => {
    const updated = assets.filter(a => a.tag !== tag);
    setAssets(updated);
    setHistory(history.filter(h => h.tag !== tag));
    return { success: true };
  };

  const allocateAsset = (tag, employeeId, location, notes) => {
    const targetEmployee = employees.find(e => e.id === employeeId);
    if (!targetEmployee) return { success: false, message: 'Employee not found.' };

    const updated = assets.map(a => {
      if (a.tag === tag) {
        return {
          ...a,
          status: 'Allocated',
          assignedTo: employeeId,
          location: location || a.location,
          allocationCount: (a.allocationCount || 0) + 1
        };
      }
      return a;
    });
    setAssets(updated);

    const histItem = {
      tag,
      type: 'Allocation',
      title: 'Asset Allocated',
      user: user?.name || 'System',
      date: new Date().toISOString().split('T')[0],
      notes: `Assigned to ${targetEmployee.name} (${targetEmployee.department}). Notes: ${notes || 'N/A'}`
    };
    setHistory([histItem, ...history]);

    addSystemNotification('Transfers', 'Asset Allocated', `Asset ${tag} was allocated to ${targetEmployee.name}.`);
    return { success: true };
  };

  const transferAsset = (tag, newEmployeeId, newLocation, notes) => {
    const targetEmployee = employees.find(e => e.id === newEmployeeId);
    if (!targetEmployee) return { success: false, message: 'Employee not found.' };

    const originalAsset = assets.find(a => a.tag === tag);
    const prevAssignee = employees.find(e => e.id === originalAsset?.assignedTo)?.name || 'Unassigned';

    const updated = assets.map(a => {
      if (a.tag === tag) {
        return {
          ...a,
          assignedTo: newEmployeeId,
          location: newLocation || a.location,
          allocationCount: (a.allocationCount || 0) + 1
        };
      }
      return a;
    });
    setAssets(updated);

    const histItem = {
      tag,
      type: 'Transfer',
      title: 'Asset Transferred',
      user: user?.name || 'System',
      date: new Date().toISOString().split('T')[0],
      notes: `Transferred from ${prevAssignee} to ${targetEmployee.name}. Notes: ${notes || 'N/A'}`
    };
    setHistory([histItem, ...history]);

    addSystemNotification('Transfers', 'Asset Transferred', `Asset ${tag} transferred to ${targetEmployee.name}.`);
    return { success: true };
  };

  const returnAsset = (tag, returnCondition, notes) => {
    const updated = assets.map(a => {
      if (a.tag === tag) {
        return {
          ...a,
          status: 'Available',
          assignedTo: null,
          condition: returnCondition || a.condition,
        };
      }
      return a;
    });
    setAssets(updated);

    const histItem = {
      tag,
      type: 'Return',
      title: 'Asset Returned',
      user: user?.name || 'System',
      date: new Date().toISOString().split('T')[0],
      notes: `Returned to inventory. Condition marked as ${returnCondition}. Notes: ${notes || 'N/A'}`
    };
    setHistory([histItem, ...history]);

    addSystemNotification('Transfers', 'Asset Returned', `Asset ${tag} returned to available pool.`);
    return { success: true };
  };

  // Bulk operations
  const bulkDeleteAssets = (tags) => {
    setAssets(assets.filter(a => !tags.includes(a.tag)));
    setHistory(history.filter(h => !tags.includes(h.tag)));
    toast.success(`Bulk deleted ${tags.length} assets.`);
  };

  const bulkTransferAssets = (tags, newEmployeeId, newLocation) => {
    const targetEmployee = employees.find(e => e.id === newEmployeeId);
    if (!targetEmployee) return { success: false, message: 'Employee not found.' };

    const updated = assets.map(a => {
      if (tags.includes(a.tag)) {
        return {
          ...a,
          assignedTo: newEmployeeId,
          location: newLocation || a.location,
          allocationCount: (a.allocationCount || 0) + 1
        };
      }
      return a;
    });
    setAssets(updated);

    tags.forEach(tag => {
      const histItem = {
        tag,
        type: 'Transfer',
        title: 'Bulk Asset Transferred',
        user: user?.name || 'System',
        date: new Date().toISOString().split('T')[0],
        notes: `Bulk transferred to ${targetEmployee.name}.`
      };
      setHistory(prev => [histItem, ...prev]);
    });

    addSystemNotification('Transfers', 'Bulk Transfer Approved', `Bulk transfer of ${tags.length} assets to ${targetEmployee.name}.`);
    return { success: true };
  };

  const bulkUpdateAssetStatus = (tags, newStatus) => {
    const updated = assets.map(a => {
      if (tags.includes(a.tag)) {
        return { ...a, status: newStatus };
      }
      return a;
    });
    setAssets(updated);

    tags.forEach(tag => {
      const histItem = {
        tag,
        type: 'Update',
        title: 'Bulk Status Update',
        user: user?.name || 'System',
        date: new Date().toISOString().split('T')[0],
        notes: `Status updated to ${newStatus} in bulk.`
      };
      setHistory(prev => [histItem, ...prev]);
    });

    toast.success(`Bulk updated status to ${newStatus} for ${tags.length} assets.`);
    return { success: true };
  };

  // Transfers Workflow
  const requestTransfer = (tag, targetEmployeeId, comments, targetLocation) => {
    const target = employees.find(e => e.id === targetEmployeeId);
    const asset = assets.find(a => a.tag === tag);
    if (!target || !asset) return { success: false, message: 'Invalid assets or employee details.' };

    const newReq = {
      id: `TRF${String(transferRequests.length + 1).padStart(3, '0')}`,
      assetTag: tag,
      assetName: asset.name,
      requesterId: user?.id || 'EMP001',
      requesterName: user?.name || 'Pandu',
      targetEmployeeId,
      targetEmployeeName: target.name,
      currentHolderId: asset.assignedTo,
      status: 'Pending',
      comments,
      date: new Date().toISOString().split('T')[0],
      targetLocation: targetLocation || 'HQ Storage'
    };

    setTransferRequests([newReq, ...transferRequests]);
    addSystemNotification('Transfers', 'Transfer Requested', `${user?.name} requested transfer of ${asset.name} to ${target.name}.`);
    return { success: true };
  };

  const approveTransferRequest = (id, comments) => {
    let tag = '';
    let targetEmpId = '';
    let targetLoc = '';
    const updated = transferRequests.map(r => {
      if (r.id === id) {
        tag = r.assetTag;
        targetEmpId = r.targetEmployeeId;
        targetLoc = r.targetLocation;
        return { ...r, status: 'Approved', comments: comments || r.comments };
      }
      return r;
    });
    setTransferRequests(updated);

    if (tag && targetEmpId) {
      transferAsset(tag, targetEmpId, targetLoc, `Approved transfer request: ${id}`);
    }
  };

  const rejectTransferRequest = (id, comments) => {
    setTransferRequests(transferRequests.map(r => r.id === id ? { ...r, status: 'Rejected', comments: comments || r.comments } : r));
    addSystemNotification('Transfers', 'Transfer Rejected', `Transfer request ${id} was rejected.`);
  };

  // Returns Workflow
  const requestReturn = (tag, notes, condition) => {
    const asset = assets.find(a => a.tag === tag);
    if (!asset) return { success: false, message: 'Asset not found.' };

    const newReq = {
      id: `RTN${String(returnRequests.length + 1).padStart(3, '0')}`,
      assetTag: tag,
      assetName: asset.name,
      employeeId: user?.id || 'EMP001',
      employeeName: user?.name || 'Pandu',
      status: 'Pending',
      returnCondition: condition || 'Good',
      notes,
      date: new Date().toISOString().split('T')[0],
    };

    setReturnRequests([newReq, ...returnRequests]);
    addSystemNotification('Transfers', 'Return Initiated', `${user?.name} initiated return process for ${asset.name}.`);
    return { success: true };
  };

  const approveReturnRequest = (id, comments) => {
    let tag = '';
    let condition = 'Good';
    const updated = returnRequests.map(r => {
      if (r.id === id) {
        tag = r.assetTag;
        condition = r.returnCondition;
        return { ...r, status: 'Approved', notes: comments || r.notes };
      }
      return r;
    });
    setReturnRequests(updated);

    if (tag) {
      returnAsset(tag, condition, `Approved return request: ${id}`);
    }
  };

  const rejectReturnRequest = (id, comments) => {
    setReturnRequests(returnRequests.map(r => r.id === id ? { ...r, status: 'Rejected', notes: comments || r.notes } : r));
    addSystemNotification('Transfers', 'Return Rejected', `Return request ${id} was rejected.`);
  };

  // Maintenance Actions
  const addMaintenanceTicket = (ticket) => {
    const newId = `MNT${String(maintenanceTickets.length + 1).padStart(3, '0')}`;
    const newTicket = {
      id: newId,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...ticket
    };
    setMaintenanceTickets([newTicket, ...maintenanceTickets]);

    const histItem = {
      tag: ticket.assetTag,
      type: 'Maintenance',
      title: 'Maintenance Request Raised',
      user: user?.name || 'System',
      date: new Date().toISOString().split('T')[0],
      notes: `Ticket raised: ${ticket.issue}. Priority: ${ticket.priority}`
    };
    setHistory([histItem, ...history]);

    addSystemNotification('Maintenance', 'New Maintenance Ticket', `Ticket ${newId} created for ${ticket.assetName}.`);
    return { success: true };
  };

  const approveMaintenanceTicket = (id, comments) => {
    let tag = '';
    const updated = maintenanceTickets.map(t => {
      if (t.id === id) {
        tag = t.assetTag;
        return { ...t, status: 'Approved', notes: comments || t.notes };
      }
      return t;
    });
    setMaintenanceTickets(updated);

    if (tag) {
      setAssets(assets.map(a => {
        if (a.tag === tag) {
          return {
            ...a,
            status: 'Maintenance',
            maintenanceCount: (a.maintenanceCount || 0) + 1
          };
        }
        return a;
      }));
      addSystemNotification('Maintenance', 'Maintenance Approved', `Ticket ${id} approved; asset under maintenance.`);
    }
  };

  const rejectMaintenanceTicket = (id, comments) => {
    setMaintenanceTickets(maintenanceTickets.map(t => t.id === id ? { ...t, status: 'Rejected', notes: comments || t.notes } : t));
    addSystemNotification('Maintenance', 'Maintenance Rejected', `Ticket ${id} was rejected.`);
  };

  const updateMaintenanceTicket = (id, updatedFields) => {
    let affectedAssetTag = null;
    const updatedTickets = maintenanceTickets.map(t => {
      if (t.id === id) {
        affectedAssetTag = t.assetTag;
        return { ...t, ...updatedFields };
      }
      return t;
    });
    setMaintenanceTickets(updatedTickets);

    // If ticket was resolved, set asset back to available
    if (updatedFields.status === 'Resolved' && affectedAssetTag) {
      setAssets(assets.map(a => a.tag === affectedAssetTag ? { ...a, status: 'Available', condition: 'Good' } : a));

      const histItem = {
        tag: affectedAssetTag,
        type: 'Maintenance',
        title: 'Maintenance Ticket Resolved',
        user: user?.name || 'System',
        date: new Date().toISOString().split('T')[0],
        notes: `Ticket ${id} resolved. Remarks: ${updatedFields.notes || 'N/A'}`
      };
      setHistory([histItem, ...history]);
      addSystemNotification('Maintenance', 'Maintenance Ticket Resolved', `Ticket ${id} resolved.`);
    }
    return { success: true };
  };

  const deleteMaintenanceTicket = (id) => {
    setMaintenanceTickets(maintenanceTickets.filter(t => t.id !== id));
  };

  // Booking Actions
  const addBooking = (newBkg) => {
    const hasConflict = bookings.some(b => {
      if (b.assetTag !== newBkg.assetTag || b.status === 'Cancelled') return false;
      const bStart = new Date(b.startTime).getTime();
      const bEnd = new Date(b.endTime).getTime();
      const nStart = new Date(newBkg.startTime).getTime();
      const nEnd = new Date(newBkg.endTime).getTime();
      return (nStart < bEnd && nEnd > bStart);
    });

    const bkgId = `BKG${String(bookings.length + 1).padStart(3, '0')}`;
    const booking = {
      id: bkgId,
      employeeId: user?.id || 'EMP001',
      employeeName: user?.name || 'Pandu',
      status: hasConflict ? 'Pending' : 'Approved',
      conflictDetected: hasConflict,
      ...newBkg
    };

    setBookings([booking, ...bookings]);

    const histItem = {
      tag: booking.assetTag,
      type: 'Booking',
      title: hasConflict ? 'Booking Conflict Flagged' : 'Resource Booked',
      user: user?.name || 'System',
      date: new Date().toISOString().split('T')[0],
      notes: `Booked for ${booking.purpose}. Conflict: ${hasConflict ? 'YES' : 'NO'}`
    };
    setHistory([histItem, ...history]);

    addSystemNotification('Bookings', hasConflict ? 'Resource Booking Conflict' : 'Resource Booking Approved', 
      `${booking.employeeName} booked ${booking.assetName}. ${hasConflict ? 'Conflict detected - waiting approval' : 'Confirmed.'}`);

    return { success: !hasConflict, booking };
  };

  const cancelBooking = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    addSystemNotification('Bookings', 'Booking Cancelled', `Booking request ${id} was cancelled.`);
    return { success: true };
  };

  // Org Setup Actions
  const addDepartment = (dept) => {
    if (departments.some(d => d.code.toUpperCase() === dept.code.toUpperCase())) {
      return { success: false, message: 'Department code already exists.' };
    }
    setDepartments([...departments, { ...dept, employeesCount: 0, assetsCount: 0, status: 'Active' }]);
    return { success: true };
  };

  const updateDepartment = (code, updatedDept) => {
    setDepartments(departments.map(d => d.code === code ? { ...d, ...updatedDept } : d));
    return { success: true };
  };

  const deleteDepartment = (code) => {
    const hasEmployees = employees.some(e => e.department === code && e.status === 'Active');
    const hasAssets = assets.some(a => a.assignedTo && employees.find(e => e.id === a.assignedTo)?.department === code);
    if (hasEmployees || hasAssets) {
      return { success: false, message: 'Cannot delete department. Active employees or allocated assets are associated with it.' };
    }
    setDepartments(departments.filter(d => d.code !== code));
    return { success: true };
  };

  const addCategory = (cat) => {
    if (categories.some(c => c.code.toUpperCase() === cat.code.toUpperCase())) {
      return { success: false, message: 'Category code already exists.' };
    }
    setCategories([...categories, { ...cat, status: 'Active' }]);
    return { success: true };
  };

  const updateCategory = (code, updatedCat) => {
    setCategories(categories.map(c => c.code === code ? { ...c, ...updatedCat } : c));
    return { success: true };
  };

  const deleteCategory = (code) => {
    const hasAssets = assets.some(a => a.category === code);
    if (hasAssets) {
      return { success: false, message: 'Cannot delete category. Active assets are associated with it.' };
    }
    setCategories(categories.filter(c => c.code !== code));
    return { success: true };
  };

  const addEmployee = (emp) => {
    if (employees.some(e => e.id.toUpperCase() === emp.id.toUpperCase())) {
      return { success: false, message: 'Employee ID already exists.' };
    }
    setEmployees([...employees, { ...emp, status: 'Active' }]);
    return { success: true };
  };

  const updateEmployee = (id, updatedEmp) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, ...updatedEmp } : e));
    if (user?.id === id) {
      setUser({ ...user, ...updatedEmp });
    }
    return { success: true };
  };

  const deleteEmployee = (id) => {
    const hasAssets = assets.some(a => a.assignedTo === id);
    if (hasAssets) {
      return { success: false, message: 'Cannot deactivate/delete employee. Asset allocations are still active.' };
    }
    setEmployees(employees.filter(e => e.id !== id));
    return { success: true };
  };

  // Audits Actions
  const updateAuditItemStatus = (assetTag, status, notes) => {
    setAuditItems(auditItems.map(item => 
      item.assetTag === assetTag ? { ...item, status, notes: notes || item.notes } : item
    ));

    if (status === 'Damaged') {
      setAssets(assets.map(a => a.tag === assetTag ? { ...a, condition: 'Poor' } : a));
    } else if (status === 'Missing') {
      setAssets(assets.map(a => a.tag === assetTag ? { ...a, status: 'Lost' } : a));
    } else if (status === 'Verified') {
      setAssets(assets.map(a => {
        if (a.tag === assetTag) {
          return { ...a, status: a.assignedTo ? 'Allocated' : 'Available', condition: 'Good', lastAudit: new Date().toISOString().split('T')[0] };
        }
        return a;
      }));
    }

    return { success: true };
  };

  // Notification Helpers
  const addSystemNotification = (type, title, message) => {
    const newId = `NTF${String(notifications.length + 1).padStart(3, '0')}`;
    const ntf = {
      id: newId,
      type,
      title,
      message,
      time: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [ntf, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const updateProfile = (profileData) => {
    setSettings({ ...settings, ...profileData });
    return { success: true };
  };

  return (
    <AppContext.Provider value={{
      user,
      departments,
      categories,
      employees,
      assets,
      bookings,
      maintenanceTickets,
      auditItems,
      history,
      notifications,
      settings,
      transferRequests,
      returnRequests,
      
      login,
      logout,
      switchUser,
      
      registerAsset,
      updateAsset,
      deleteAsset,
      allocateAsset,
      transferAsset,
      returnAsset,
      
      bulkDeleteAssets,
      bulkTransferAssets,
      bulkUpdateAssetStatus,
      
      requestTransfer,
      approveTransferRequest,
      rejectTransferRequest,
      
      requestReturn,
      approveReturnRequest,
      rejectReturnRequest,
      
      addMaintenanceTicket,
      approveMaintenanceTicket,
      rejectMaintenanceTicket,
      updateMaintenanceTicket,
      deleteMaintenanceTicket,
      
      addBooking,
      cancelBooking,
      
      addDepartment,
      updateDepartment,
      deleteDepartment,
      
      addCategory,
      updateCategory,
      deleteCategory,
      
      addEmployee,
      updateEmployee,
      deleteEmployee,
      
      updateAuditItemStatus,
      
      markNotificationRead,
      markAllNotificationsRead,
      updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
