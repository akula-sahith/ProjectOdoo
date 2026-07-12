import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('af_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState([]);
  const [auditItems, setAuditItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
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
  });
  const [transferRequests, setTransferRequests] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);

  // Condition mapping helpers
  const mapConditionToFrontend = (c) => {
    const map = { NEW: 'Excellent', GOOD: 'Good', FAIR: 'Fair', POOR: 'Poor', DAMAGED: 'Poor' };
    return map[c] || 'Good';
  };

  const mapConditionToBackend = (c) => {
    const map = { Excellent: 'NEW', Good: 'GOOD', Fair: 'FAIR', Poor: 'POOR' };
    return map[c] || 'GOOD';
  };

  // Status mapping helpers
  const mapStatusToFrontend = (s) => {
    const map = { AVAILABLE: 'Available', ALLOCATED: 'Allocated', UNDER_MAINTENANCE: 'Maintenance', LOST: 'Lost', RETIRED: 'Disposed' };
    return map[s] || 'Available';
  };

  const mapStatusToBackend = (s) => {
    const map = { Available: 'AVAILABLE', Allocated: 'ALLOCATED', Maintenance: 'UNDER_MAINTENANCE', Lost: 'LOST', Disposed: 'RETIRED' };
    return map[s] || 'AVAILABLE';
  };

  // Map backend user to UI format
  const mapUser = (dbUser) => {
    if (!dbUser) return null;
    return {
      id: dbUser.employee_code || `EMP${dbUser.user_id}`,
      user_id: dbUser.user_id,
      name: dbUser.full_name,
      email: dbUser.email,
      phone: dbUser.phone || '+1-555-0100',
      department: dbUser.department?.department_name || '',
      department_id: dbUser.department_id,
      designation: dbUser.role?.description || dbUser.role?.role_name || 'Staff',
      role: dbUser.role?.role_name === 'ADMIN' ? 'Admin' :
            dbUser.role?.role_name === 'ASSET_MANAGER' ? 'Asset Manager' :
            dbUser.role?.role_name === 'DEPARTMENT_HEAD' ? 'Department Head' : 'Employee',
      status: dbUser.status === 'ACTIVE' ? 'Active' : 'Inactive',
      joiningDate: dbUser.created_at ? new Date(dbUser.created_at).toISOString().split('T')[0] : '2025-01-01',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
    };
  };

  // Map backend department to UI format
  const mapDepartment = (dbDept) => {
    if (!dbDept) return null;
    return {
      code: dbDept.department_name.toUpperCase().substring(0, 3),
      department_id: dbDept.department_id,
      name: dbDept.department_name,
      head: dbDept.departmentHead?.full_name || 'Unassigned',
      employeesCount: dbDept.users?.length || 0,
      assetsCount: dbDept.users?.reduce((sum, u) => sum + (u.allocationsTo?.length || 0), 0) || 0,
      status: dbDept.status === 'ACTIVE' ? 'Active' : 'Inactive',
      phone: '+1-555-0101',
      email: `${dbDept.department_name.toLowerCase().replace(/\s+/g, '')}@assetflow.com`,
      description: 'Corporate department unit.'
    };
  };

  // Map backend category to UI format
  const mapCategory = (dbCat) => {
    if (!dbCat) return null;
    return {
      category_id: dbCat.category_id,
      code: dbCat.category_name.toUpperCase().substring(0, 3),
      name: dbCat.category_name,
      description: dbCat.description || '',
      warrantyRequired: (dbCat.warranty_period || 0) > 0,
      maintenanceCycle: 12,
      assetLifetime: 5,
      status: dbCat.status === 'ACTIVE' ? 'Active' : 'Inactive'
    };
  };

  // Map backend booking to UI format
  const mapBooking = (dbBkg) => {
    if (!dbBkg) return null;
    return {
      id: dbBkg.booking_id,
      booking_id: dbBkg.booking_id,
      assetTag: dbBkg.asset?.asset_tag || '',
      assetName: dbBkg.asset?.asset_name || '',
      employeeId: dbBkg.employee?.employee_code || '',
      employeeName: dbBkg.employee?.full_name || '',
      purpose: dbBkg.purpose || '',
      startTime: dbBkg.start_time ? new Date(dbBkg.start_time).toISOString().substring(0, 16) : '',
      endTime: dbBkg.end_time ? new Date(dbBkg.end_time).toISOString().substring(0, 16) : '',
      status: dbBkg.status === 'APPROVED' ? 'Approved' : dbBkg.status === 'PENDING' ? 'Pending' : 'Cancelled',
      conflictDetected: false
    };
  };

  // Map backend maintenance to UI format
  const mapMaintenance = (dbMnt) => {
    if (!dbMnt) return null;
    return {
      id: dbMnt.maintenance_id,
      maintenance_id: dbMnt.maintenance_id,
      assetTag: dbMnt.asset?.asset_tag || '',
      assetName: dbMnt.asset?.asset_name || '',
      issue: dbMnt.issue_description || '',
      technician: dbMnt.technician_name || 'Unassigned',
      status: dbMnt.status === 'PENDING' ? 'Pending' : dbMnt.status === 'APPROVED' ? 'Approved' : dbMnt.status === 'IN_PROGRESS' ? 'In Progress' : 'Resolved',
      priority: dbMnt.priority === 'HIGH' ? 'High' : dbMnt.priority === 'MEDIUM' ? 'Medium' : 'Low',
      dueDate: dbMnt.resolved_at ? new Date(dbMnt.resolved_at).toISOString().split('T')[0] : new Date(new Date().getTime() + 5*24*60*60*1000).toISOString().split('T')[0],
      createdDate: dbMnt.raised_at ? new Date(dbMnt.raised_at).toISOString().split('T')[0] : '',
      notes: dbMnt.remarks || ''
    };
  };

  // Map backend transfer request to UI format
  const mapTransfer = (dbTrf) => {
    if (!dbTrf) return null;
    return {
      id: dbTrf.transfer_id,
      transfer_id: dbTrf.transfer_id,
      assetTag: dbTrf.asset?.asset_tag || '',
      assetName: dbTrf.asset?.asset_name || '',
      requesterId: dbTrf.requester?.employee_code || '',
      requesterName: dbTrf.requester?.full_name || '',
      targetEmployeeId: dbTrf.toEmployee?.employee_code || '',
      targetEmployeeName: dbTrf.toEmployee?.full_name || '',
      currentHolderId: dbTrf.fromEmployee?.employee_code || '',
      status: dbTrf.status === 'PENDING' || dbTrf.status === 'REQUESTED' ? 'Pending' : dbTrf.status === 'APPROVED' ? 'Approved' : dbTrf.status === 'REJECTED' ? 'Rejected' : 'Completed',
      comments: '',
      date: dbTrf.requested_at ? new Date(dbTrf.requested_at).toISOString().split('T')[0] : '',
      targetLocation: dbTrf.toEmployee?.department?.department_name || 'HQ Storage'
    };
  };

  const fetchInitialData = async () => {
    try {
      const [
        deptsRes,
        catsRes,
        usersRes,
        assetsRes,
        bkgsRes,
        mntRes,
        trfsRes,
        notifsRes
      ] = await Promise.all([
        api.get('/departments'),
        api.get('/categories'),
        api.get('/users'),
        api.get('/assets'),
        api.get('/bookings'),
        api.get('/maintenance'),
        api.get('/transfers'),
        api.get('/notifications').catch(() => ({ data: [] }))
      ]);

      const mappedDepts = deptsRes.data.map(mapDepartment);
      const mappedCats = catsRes.data.map(mapCategory);
      const mappedEmployees = usersRes.data.map(mapUser);
      
      const mappedAssets = assetsRes.data.map(a => {
        const activeAlloc = a.allocations?.find(al => al.status === 'ACTIVE');
        const assignedEmployeeObj = activeAlloc ? usersRes.data.find(u => u.user_id === activeAlloc.employee_id) : null;
        return {
          asset_id: a.asset_id,
          tag: a.asset_tag,
          name: a.asset_name,
          serial: a.serial_number,
          category_id: a.category_id,
          category: a.category?.category_name || '',
          purchaseCost: Number(a.purchase_cost || 0),
          condition: mapConditionToFrontend(a.condition),
          status: mapStatusToFrontend(a.status),
          location: a.location || 'HQ Storage',
          assignedTo: assignedEmployeeObj ? assignedEmployeeObj.employee_code : null,
          purchaseDate: a.purchase_date ? new Date(a.purchase_date).toISOString().split('T')[0] : '',
          is_bookable: a.is_bookable,
          image: a.photo_url || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=200',
          shared: a.is_bookable,
          allocationCount: a.allocations?.length || 0,
          maintenanceCount: a.maintenance?.length || 0,
          lastAudit: a.auditRecords?.[0]?.verified_at ? new Date(a.auditRecords[0].verified_at).toISOString().split('T')[0] : 'N/A',
          allocations: a.allocations || []
        };
      });

      setDepartments(mappedDepts);
      setCategories(mappedCats);
      setEmployees(mappedEmployees);
      setAssets(mappedAssets);
      setBookings(bkgsRes.data.map(mapBooking));
      setMaintenanceTickets(mntRes.data.map(mapMaintenance));
      setTransferRequests(trfsRes.data.map(mapTransfer));
      
      setNotifications((notifsRes.data || []).map(n => ({
        id: n.notification_id,
        type: n.type || 'Alerts',
        title: n.title,
        message: n.message,
        time: n.created_at,
        read: n.is_read
      })));

      const historyLogs = [];
      assetsRes.data.forEach(a => {
        (a.allocations || []).forEach(al => {
          const emp = usersRes.data.find(u => u.user_id === al.employee_id);
          historyLogs.push({
            tag: a.asset_tag,
            type: al.status === 'ACTIVE' ? 'Allocation' : 'Return',
            title: al.status === 'ACTIVE' ? 'Asset Allocated' : 'Asset Returned',
            user: al.allocatedBy?.full_name || 'System',
            date: new Date(al.allocation_date).toISOString().split('T')[0],
            notes: al.status === 'ACTIVE' ? `Allocated to ${emp?.full_name || 'Employee'}` : `Returned. Notes: ${al.checkin_notes || 'N/A'}`
          });
        });
      });
      setHistory(historyLogs);

      const cyclesRes = await api.get('/audit/cycles');
      const activeCycle = cyclesRes.data.find(c => c.status === 'IN_PROGRESS' || c.status === 'SCHEDULED');
      if (activeCycle) {
        const cycleDetail = await api.get(`/audit/cycles/${activeCycle.audit_cycle_id}`);
        const records = cycleDetail.data.records || [];
        
        const checklist = assetsRes.data.map(a => {
          const record = records.find(r => r.asset_id === a.asset_id);
          const activeAlloc = a.allocations?.find(al => al.status === 'ACTIVE');
          const emp = activeAlloc ? usersRes.data.find(u => u.user_id === activeAlloc.employee_id) : null;
          
          return {
            asset_id: a.asset_id,
            audit_cycle_id: activeCycle.audit_cycle_id,
            assetTag: a.asset_tag,
            assetName: a.asset_name,
            category: a.category?.category_name || '',
            location: a.location || 'HQ Storage',
            expectedAssignee: emp ? emp.full_name : 'Shared Pool',
            status: record ? (record.verification_status === 'VERIFIED' ? 'Verified' : record.verification_status === 'MISSING' ? 'Missing' : 'Damaged') : 'Pending',
            notes: record?.remarks || ''
          };
        });
        setAuditItems(checklist);
      } else {
        setAuditItems([]);
      }

    } catch (err) {
      console.error('Error fetching initial data from backend:', err);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('af_user', JSON.stringify(user));
      fetchInitialData();
    } else {
      localStorage.removeItem('af_user');
    }
  }, [user]);

  // Auth event listener for 401
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Auth Functions
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const mappedUser = mapUser(res.user);
      setUser(mappedUser);
      localStorage.setItem('af_accessToken', res.tokens.accessToken);
      localStorage.setItem('af_refreshToken', res.tokens.refreshToken);
      return { success: true, user: mappedUser };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('af_user');
    localStorage.removeItem('af_accessToken');
    localStorage.removeItem('af_refreshToken');
  };

  const switchUser = async (userId) => {
    const found = employees.find(e => e.id === userId);
    if (found) {
      const res = await login(found.email, 'password123');
      if (res.success) {
        toast.success(`Switched role to ${found.name} (${found.role})`);
      } else {
        toast.error(res.message);
      }
    }
  };

  // Asset Actions
  const registerAsset = async (newAsset) => {
    try {
      const category = categories.find(c => c.code === newAsset.category || c.name === newAsset.category);
      const res = await api.post('/assets', {
        asset_tag: newAsset.tag,
        asset_name: newAsset.name,
        serial_number: newAsset.serial,
        category_id: category ? category.category_id : 1,
        purchase_date: newAsset.purchaseDate ? new Date(newAsset.purchaseDate) : null,
        purchase_cost: Number(newAsset.purchaseCost || 0),
        condition: mapConditionToBackend(newAsset.condition || 'Good'),
        location: newAsset.location || 'HQ Storage',
        is_bookable: newAsset.is_bookable || false,
        photo_url: newAsset.image || ''
      });
      await fetchInitialData();
      return { success: true, asset: res.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateAsset = async (tag, updatedAsset) => {
    try {
      const assetObj = assets.find(a => a.tag === tag);
      if (!assetObj) throw new Error('Asset not found');
      
      const payload = {};
      if (updatedAsset.name) payload.asset_name = updatedAsset.name;
      if (updatedAsset.serial) payload.serial_number = updatedAsset.serial;
      if (updatedAsset.location) payload.location = updatedAsset.location;
      if (updatedAsset.purchaseCost !== undefined) payload.purchase_cost = Number(updatedAsset.purchaseCost);
      if (updatedAsset.condition) payload.condition = mapConditionToBackend(updatedAsset.condition);
      if (updatedAsset.status) payload.status = mapStatusToBackend(updatedAsset.status);
      if (updatedAsset.is_bookable !== undefined) payload.is_bookable = updatedAsset.is_bookable;
      if (updatedAsset.image) payload.photo_url = updatedAsset.image;
      
      await api.put(`/assets/${assetObj.asset_id}`, payload);
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteAsset = async (tag) => {
    try {
      const assetObj = assets.find(a => a.tag === tag);
      if (!assetObj) throw new Error('Asset not found');
      await api.delete(`/assets/${assetObj.asset_id}`);
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const allocateAsset = async (tag, employeeId, location, notes) => {
    try {
      const assetObj = assets.find(a => a.tag === tag);
      if (!assetObj) throw new Error('Asset not found');
      const employeeObj = employees.find(e => e.id === employeeId);
      if (!employeeObj) throw new Error('Employee not found');
      
      await api.post('/allocations', {
        asset_id: assetObj.asset_id,
        employee_id: employeeObj.user_id,
        location: location || assetObj.location,
        notes: notes || ''
      });
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const transferAsset = async (tag, newEmployeeId, newLocation, notes) => {
    try {
      const assetObj = assets.find(a => a.tag === tag);
      if (!assetObj) throw new Error('Asset not found');
      const employeeObj = employees.find(e => e.id === newEmployeeId);
      if (!employeeObj) throw new Error('Employee not found');
      
      await api.post('/transfers', {
        asset_id: assetObj.asset_id,
        to_employee: employeeObj.user_id,
        location: newLocation || assetObj.location,
        notes: notes || ''
      });
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const returnAsset = async (tag, returnCondition, notes) => {
    try {
      const assetObj = assets.find(a => a.tag === tag);
      if (!assetObj) throw new Error('Asset not found');
      const activeAlloc = assetObj.allocations?.find(al => al.status === 'ACTIVE');
      if (!activeAlloc) throw new Error('No active allocation found for this asset');
      
      await api.put(`/allocations/${activeAlloc.allocation_id}/return`, {
        checkin_notes: notes || `Returned in ${returnCondition} condition.`
      });
      if (returnCondition) {
        await api.put(`/assets/${assetObj.asset_id}`, {
          condition: mapConditionToBackend(returnCondition)
        });
      }
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Bulk operations (Simulated via sequential API calls to ensure db updates)
  const bulkDeleteAssets = async (tags) => {
    try {
      await Promise.all(tags.map(tag => deleteAsset(tag)));
      toast.success(`Bulk deleted ${tags.length} assets.`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const bulkTransferAssets = async (tags, newEmployeeId, newLocation) => {
    try {
      await Promise.all(tags.map(tag => transferAsset(tag, newEmployeeId, newLocation, 'Bulk transfer')));
      toast.success(`Bulk transferred ${tags.length} assets.`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const bulkUpdateAssetStatus = async (tags, newStatus) => {
    try {
      await Promise.all(tags.map(tag => updateAsset(tag, { status: newStatus })));
      toast.success(`Bulk updated status to ${newStatus} for ${tags.length} assets.`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Transfers Workflow
  const requestTransfer = async (tag, targetEmployeeId, comments, targetLocation) => {
    try {
      const assetObj = assets.find(a => a.tag === tag);
      if (!assetObj) throw new Error('Asset not found');
      const employeeObj = employees.find(e => e.id === targetEmployeeId);
      if (!employeeObj) throw new Error('Employee not found');
      
      await api.post('/transfers', {
        asset_id: assetObj.asset_id,
        to_employee: employeeObj.user_id,
        location: targetLocation || assetObj.location,
        notes: comments || ''
      });
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const approveTransferRequest = async (id, comments) => {
    try {
      await api.put(`/transfers/${id}/approve`);
      // Auto complete the transfer to apply it to allocations
      await api.put(`/transfers/${id}/complete`);
      await fetchInitialData();
      toast.success('Transfer approved and completed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const rejectTransferRequest = async (id, comments) => {
    try {
      await api.put(`/transfers/${id}/reject`);
      await fetchInitialData();
      toast.success('Transfer request rejected');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Returns Workflow
  const requestReturn = async (tag, notes, condition) => {
    try {
      const newReq = {
        id: `RTN${String(returnRequests.length + 1).padStart(3, '0')}`,
        assetTag: tag,
        assetName: assets.find(a => a.tag === tag)?.name || '',
        employeeId: user?.id || '',
        employeeName: user?.name || '',
        status: 'Pending',
        returnCondition: condition || 'Good',
        notes,
        date: new Date().toISOString().split('T')[0]
      };
      setReturnRequests([newReq, ...returnRequests]);
      toast.success('Return requested');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const approveReturnRequest = async (id, comments) => {
    try {
      const req = returnRequests.find(r => r.id === id);
      if (!req) return;
      
      const res = await returnAsset(req.assetTag, req.returnCondition, comments || req.notes);
      if (res.success) {
        setReturnRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
        toast.success('Return request approved');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const rejectReturnRequest = async (id, comments) => {
    setReturnRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    toast.success('Return request rejected');
  };

  // Maintenance Actions
  const addMaintenanceTicket = async (ticket) => {
    try {
      const assetObj = assets.find(a => a.tag === ticket.assetTag);
      if (!assetObj) throw new Error('Asset not found');
      
      await api.post('/maintenance', {
        asset_id: assetObj.asset_id,
        priority: ticket.priority.toUpperCase(),
        issue_description: ticket.issue
      });
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const approveMaintenanceTicket = async (id, comments) => {
    try {
      await api.put(`/maintenance/${id}/status`, {
        status: 'APPROVED',
        remarks: comments || ''
      });
      await fetchInitialData();
      toast.success('Maintenance ticket approved');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const rejectMaintenanceTicket = async (id, comments) => {
    try {
      await api.put(`/maintenance/${id}/status`, {
        status: 'RESOLVED', // Reject maps to resolving/cancelling
        remarks: comments || 'Rejected'
      });
      await fetchInitialData();
      toast.success('Maintenance ticket rejected');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateMaintenanceTicket = async (id, updatedFields) => {
    try {
      const payload = {};
      if (updatedFields.status) {
        const statusMap = {
          'In Progress': 'IN_PROGRESS',
          'Approved': 'APPROVED',
          'Resolved': 'RESOLVED',
          'Pending': 'PENDING'
        };
        payload.status = statusMap[updatedFields.status] || 'PENDING';
      }
      if (updatedFields.technician) payload.technician_name = updatedFields.technician;
      if (updatedFields.notes) payload.remarks = updatedFields.notes;
      
      await api.put(`/maintenance/${id}/status`, payload);
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteMaintenanceTicket = async (id) => {
    try {
      // Simulate resolving/deleting maintenance
      await api.put(`/maintenance/${id}/status`, { status: 'RESOLVED', remarks: 'Deleted' });
      await fetchInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  // Booking Actions
  const addBooking = async (newBkg) => {
    try {
      const assetObj = assets.find(a => a.tag === newBkg.assetTag);
      if (!assetObj) throw new Error('Asset not found');
      
      const res = await api.post('/bookings', {
        asset_id: assetObj.asset_id,
        start_time: new Date(newBkg.startTime),
        end_time: new Date(newBkg.endTime),
        purpose: newBkg.purpose || ''
      });
      await fetchInitialData();
      return { success: true, booking: mapBooking(res.data) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const cancelBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Org Setup Actions
  const addDepartment = async (dept) => {
    try {
      await api.post('/departments', {
        department_name: dept.name,
        status: 'ACTIVE'
      });
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateDepartment = async (code, updatedDept) => {
    try {
      const deptObj = departments.find(d => d.code === code);
      if (!deptObj) throw new Error('Department not found');
      await api.put(`/departments/${deptObj.department_id}`, {
        department_name: updatedDept.name,
        status: updatedDept.status === 'Active' ? 'ACTIVE' : 'INACTIVE'
      });
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteDepartment = async (code) => {
    try {
      const deptObj = departments.find(d => d.code === code);
      if (!deptObj) throw new Error('Department not found');
      await api.delete(`/departments/${deptObj.department_id}`);
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const addCategory = async (cat) => {
    try {
      await api.post('/categories', {
        category_name: cat.name,
        description: cat.description || '',
        warranty_period: cat.warrantyRequired ? 12 : 0,
        status: 'ACTIVE'
      });
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateCategory = async (code, updatedCat) => {
    try {
      const catObj = categories.find(c => c.code === code);
      if (!catObj) throw new Error('Category not found');
      await api.put(`/categories/${catObj.category_id}`, {
        category_name: updatedCat.name,
        description: updatedCat.description || '',
        warranty_period: updatedCat.warrantyRequired ? 12 : 0,
        status: updatedCat.status === 'Active' ? 'ACTIVE' : 'INACTIVE'
      });
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteCategory = async (code) => {
    try {
      const catObj = categories.find(c => c.code === code);
      if (!catObj) throw new Error('Category not found');
      await api.delete(`/categories/${catObj.category_id}`);
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const addEmployee = async (emp) => {
    try {
      const role = emp.role === 'Admin' ? 'ADMIN' : emp.role === 'Asset Manager' ? 'ASSET_MANAGER' : emp.role === 'Department Head' ? 'DEPARTMENT_HEAD' : 'EMPLOYEE';
      const dept = departments.find(d => d.code === emp.department);
      await api.post('/auth/register', {
        employee_code: emp.id,
        full_name: emp.name,
        email: emp.email,
        password: 'password123',
        role_name: role,
        department_id: dept ? dept.department_id : null
      });
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateEmployee = async (id, updatedEmp) => {
    try {
      const empObj = employees.find(e => e.id === id);
      if (!empObj) throw new Error('User not found');
      const dept = departments.find(d => d.code === updatedEmp.department);
      
      const payload = {
        full_name: updatedEmp.name,
        email: updatedEmp.email,
        department_id: dept ? dept.department_id : null,
        status: updatedEmp.status === 'Active' ? 'ACTIVE' : 'INACTIVE'
      };
      
      await api.put(`/users/${empObj.user_id}`, payload);
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const empObj = employees.find(e => e.id === id);
      if (!empObj) throw new Error('User not found');
      await api.delete(`/users/${empObj.user_id}`);
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Audits Actions
  const updateAuditItemStatus = async (assetTag, status, notes) => {
    try {
      const item = auditItems.find(i => i.assetTag === assetTag);
      if (!item) throw new Error('Audit item not found');
      
      await api.post('/audit/records', {
        audit_cycle_id: item.audit_cycle_id,
        asset_id: item.asset_id,
        verification_status: status.toUpperCase(),
        remarks: notes || ''
      });
      await fetchInitialData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      await fetchInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await Promise.all(notifications.map(n => markNotificationRead(n.id)));
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setSettings(prev => ({ ...prev, ...profileData }));
      toast.success('Company profile updated locally');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
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
