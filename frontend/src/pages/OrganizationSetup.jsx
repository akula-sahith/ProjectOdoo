import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import {
  Building2,
  FolderOpen,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Mail,
  Phone,
  ShieldAlert,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export const OrganizationSetup = () => {
  const {
    user,
    departments,
    categories,
    employees,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addCategory,
    updateCategory,
    deleteCategory,
    addEmployee,
    updateEmployee,
    deleteEmployee
  } = useApp();

  const [activeTab, setActiveTab] = useState('departments');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals visibility states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  // 1. Department Form
  const [deptForm, setDeptForm] = useState({ name: '', code: '', head: '', phone: '', email: '', description: '' });
  // 2. Category Form
  const [catForm, setCatForm] = useState({ name: '', code: '', description: '', warrantyRequired: true, maintenanceCycle: 12, assetLifetime: 5 });
  // 3. Employee Form
  const [empForm, setEmpForm] = useState({ id: '', name: '', email: '', phone: '', department: 'ENG', designation: '', role: 'Employee', manager: '' });

  // Open modal helper
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setIsModalOpen(true);

    if (activeTab === 'departments') {
      if (type === 'edit' && item) {
        setDeptForm({ ...item });
      } else {
        setDeptForm({ name: '', code: '', head: '', phone: '', email: '', description: '' });
      }
    } else if (activeTab === 'categories') {
      if (type === 'edit' && item) {
        setCatForm({ ...item });
      } else {
        setCatForm({ name: '', code: '', description: '', warrantyRequired: true, maintenanceCycle: 12, assetLifetime: 5 });
      }
    } else if (activeTab === 'employees') {
      if (type === 'edit' && item) {
        setEmpForm({ ...item });
      } else {
        setEmpForm({ id: '', name: '', email: '', phone: '', department: 'ENG', designation: '', role: 'Employee', manager: '' });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Submit handlers
  const handleDeptSubmit = (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) {
      toast.error('Name and Code are required.');
      return;
    }
    if (modalType === 'add') {
      const res = addDepartment(deptForm);
      if (res.success) {
        toast.success('Department created successfully.');
        handleModalClose();
      } else {
        toast.error(res.message);
      }
    } else {
      updateDepartment(selectedItem.code, deptForm);
      toast.success('Department updated successfully.');
      handleModalClose();
    }
  };

  const handleCatSubmit = (e) => {
    e.preventDefault();
    if (!catForm.name || !catForm.code) {
      toast.error('Name and Code are required.');
      return;
    }
    if (modalType === 'add') {
      const res = addCategory(catForm);
      if (res.success) {
        toast.success('Category created successfully.');
        handleModalClose();
      } else {
        toast.error(res.message);
      }
    } else {
      updateCategory(selectedItem.code, catForm);
      toast.success('Category updated successfully.');
      handleModalClose();
    }
  };

  const handleEmpSubmit = (e) => {
    e.preventDefault();
    if (!empForm.id || !empForm.name || !empForm.email) {
      toast.error('Employee ID, Name, and Email are required.');
      return;
    }
    
    // Admin check for role assignment
    if (empForm.role !== (selectedItem?.role || 'Employee') && user?.role !== 'Admin') {
      toast.error('Only Admins can assign and update system security roles.');
      return;
    }

    if (modalType === 'add') {
      const res = addEmployee(empForm);
      if (res.success) {
        toast.success('Employee registered successfully.');
        handleModalClose();
      } else {
        toast.error(res.message);
      }
    } else {
      updateEmployee(selectedItem.id, empForm);
      toast.success('Employee details updated.');
      handleModalClose();
    }
  };

  // Delete handlers
  const handleDeleteItem = (item) => {
    if (confirm(`Are you sure you want to delete ${item.name || item.code}?`)) {
      if (activeTab === 'departments') {
        const res = deleteDepartment(item.code);
        if (res.success) {
          toast.success('Department deleted successfully.');
        } else {
          toast.error(res.message);
        }
      } else if (activeTab === 'categories') {
        const res = deleteCategory(item.code);
        if (res.success) {
          toast.success('Category deleted.');
        } else {
          toast.error(res.message);
        }
      } else if (activeTab === 'employees') {
        const res = deleteEmployee(item.id);
        if (res.success) {
          toast.success('Employee record removed.');
        } else {
          toast.error(res.message);
        }
      }
    }
  };

  // Searching logic
  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCats = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEmps = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Setup</h1>
          <p className="text-slate-500 text-sm mt-1">Manage corporate departments, categories, and system-wide personnel directory.</p>
        </div>
      </div>

      {/* Tabs list & search action row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl w-full md:w-auto">
          <button
            onClick={() => { setActiveTab('departments'); setSearchQuery(''); }}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'departments' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> Departments
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'categories' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderOpen className="w-4 h-4" /> Asset Categories
          </button>
          <button
            onClick={() => { setActiveTab('employees'); setSearchQuery(''); }}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'employees' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Employees
          </button>
        </div>

        {/* Search input & Add button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all"
            />
          </div>
          <button
            onClick={() => openModal('add')}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Active Tab rendering */}
        {activeTab === 'departments' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-4">Department Code</th>
                  <th className="px-6 py-4">Department Name</th>
                  <th className="px-6 py-4">Dept Head</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Assets Count</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredDepts.map((d) => (
                  <tr key={d.code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{d.code}</td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">{d.name}</td>
                    <td className="px-6 py-4 text-slate-550">
                      {employees.find(e => e.id === d.head)?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs"><Mail className="w-3.5 h-3.5 text-slate-400" /> {d.email}</div>
                      <div className="flex items-center gap-1.5 text-xs"><Phone className="w-3.5 h-3.5 text-slate-400" /> {d.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{d.assetsCount} allocated</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      <button
                        onClick={() => openModal('edit', d)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-550 hover:text-slate-800 transition-all cursor-pointer"
                        title="Edit Department"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(d)}
                        className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                        title="Delete Department"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredDepts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">No departments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-4">Category Code</th>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Warranty Required</th>
                  <th className="px-6 py-4">Maintenance cycle</th>
                  <th className="px-6 py-4">Lifetime</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCats.map((c) => (
                  <tr key={c.code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{c.code}</td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">{c.name}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{c.description}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {c.warrantyRequired ? 'Yes (Mandatory)' : 'No'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{c.maintenanceCycle} months</td>
                    <td className="px-6 py-4 text-slate-600">{c.assetLifetime} Years</td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      <button
                        onClick={() => openModal('edit', c)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-550 hover:text-slate-800 transition-all cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(c)}
                        className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCats.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Department & Designation</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Access Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredEmps.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{e.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={e.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60'}
                          alt=""
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                        />
                        <span className="font-semibold text-slate-700">{e.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="font-semibold">{departments.find(d => d.code === e.department)?.name || e.department}</div>
                      <div className="text-xs text-slate-450 mt-0.5">{e.designation}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{e.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
                        e.role === 'Admin' 
                          ? 'bg-red-50 text-red-700 border-red-150' 
                          : e.role === 'Asset Manager' 
                            ? 'bg-blue-50 text-blue-700 border-blue-155' 
                            : e.role === 'Department Head' 
                              ? 'bg-purple-50 text-purple-700 border-purple-150' 
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {e.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      <button
                        onClick={() => openModal('edit', e)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-550 hover:text-slate-800 transition-all cursor-pointer"
                        title="Edit Employee"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(e)}
                        className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                        title="Deactivate/Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEmps.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">No employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reusable setup Modal forms */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={`${modalType === 'add' ? 'Add New' : 'Edit'} ${
          activeTab === 'departments' ? 'Department' : activeTab === 'categories' ? 'Asset Category' : 'Employee'
        }`}
        size={activeTab === 'employees' ? 'lg' : 'md'}
      >
        {activeTab === 'departments' && (
          <form onSubmit={handleDeptSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  disabled={modalType === 'edit'}
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. INFRA"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Infrastructure Ops"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department Head *</label>
              <select
                value={deptForm.head}
                onChange={(e) => setDeptForm({ ...deptForm, head: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
              >
                <option value="">Select Department Head</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Helpline</label>
                <input
                  type="text"
                  value={deptForm.phone}
                  onChange={(e) => setDeptForm({ ...deptForm, phone: e.target.value })}
                  placeholder="+1-555-xxxx"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Group Email</label>
                <input
                  type="email"
                  value={deptForm.email}
                  onChange={(e) => setDeptForm({ ...deptForm, email: e.target.value })}
                  placeholder="dept@company.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Brief Description</label>
              <textarea
                value={deptForm.description}
                onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                rows="3"
                placeholder="Description of department activities..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {activeTab === 'categories' && (
          <form onSubmit={handleCatSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category Code *</label>
                <input
                  type="text"
                  required
                  disabled={modalType === 'edit'}
                  value={catForm.code}
                  onChange={(e) => setCatForm({ ...catForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. MOB"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Mobile Phones"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
              <textarea
                value={catForm.description}
                onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                rows="3"
                placeholder="Asset category notes..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Maintenance Cycle (Months)</label>
                <input
                  type="number"
                  min="1"
                  value={catForm.maintenanceCycle}
                  onChange={(e) => setCatForm({ ...catForm, maintenanceCycle: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Estimated Asset Lifetime (Years)</label>
                <input
                  type="number"
                  min="1"
                  value={catForm.assetLifetime}
                  onChange={(e) => setCatForm({ ...catForm, assetLifetime: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="warrantyReq"
                type="checkbox"
                checked={catForm.warrantyRequired}
                onChange={(e) => setCatForm({ ...catForm, warrantyRequired: e.target.checked })}
                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
              />
              <label htmlFor="warrantyReq" className="ml-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                Warranty Certificate Required on Registration
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {activeTab === 'employees' && (
          <form onSubmit={handleEmpSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Employee ID *</label>
                <input
                  type="text"
                  required
                  disabled={modalType === 'edit'}
                  value={empForm.id}
                  onChange={(e) => setEmpForm({ ...empForm, id: e.target.value.toUpperCase() })}
                  placeholder="e.g. EMP088"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={empForm.name}
                  onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                  placeholder="Full legal name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={empForm.email}
                  onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={empForm.phone}
                  onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                  placeholder="+1-555-xxxx"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Department *</label>
                <select
                  value={empForm.department}
                  onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                >
                  {departments.map(d => (
                    <option key={d.code} value={d.code}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  value={empForm.designation}
                  onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                  placeholder="e.g. Lead Dev Ops"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Reporting Line Manager</label>
                <input
                  type="text"
                  value={empForm.manager}
                  onChange={(e) => setEmpForm({ ...empForm, manager: e.target.value })}
                  placeholder="Manager name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                SECURITY ROLE ASSIGNMENT
              </div>
              <p className="text-[11px] text-slate-450">Assigning security roles allows this employee to access distinct administrative tabs.</p>
              
              <div className="mt-2.5">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Access Role *</label>
                <select
                  value={empForm.role}
                  disabled={user?.role !== 'Admin'}
                  onChange={(e) => setEmpForm({ ...empForm, role: e.target.value })}
                  className="w-full bg-white px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-450"
                >
                  <option value="Employee">Employee (Self Service booking/tickets)</option>
                  <option value="Department Head">Department Head (Approve local bookings & transfers)</option>
                  <option value="Asset Manager">Asset Manager (Manage lifecycle, audits, setups)</option>
                  <option value="Admin">System Admin (Full rights, modify system configurations)</option>
                </select>
                {user?.role !== 'Admin' && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">⚠️ Only System Admins can change authorization roles.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm cursor-pointer"
              >
                Save Employee
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default OrganizationSetup;
