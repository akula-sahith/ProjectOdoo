import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { StatusBadge, ConditionBadge } from '../components/Badges';
import {
  Search,
  SlidersHorizontal,
  Plus,
  QrCode,
  Eye,
  Edit,
  UserCheck,
  Send,
  Wrench,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  Layers,
  ArrowRightLeft,
  Settings,
  Archive,
  RefreshCw,
  FolderOpen,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const Assets = () => {
  const {
    assets,
    categories,
    departments,
    employees,
    user,
    registerAsset,
    updateAsset,
    deleteAsset,
    bulkDeleteAssets,
    bulkTransferAssets,
    bulkUpdateAssetStatus,
    requestTransfer,
    requestReturn
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [purchaseDateFilter, setPurchaseDateFilter] = useState('');

  // Skeleton state
  const [loading, setLoading] = useState(false);

  // Checkbox selection states
  const [selectedTags, setSelectedTags] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals visibility states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isBulkTransferOpen, setIsBulkTransferOpen] = useState(false);
  const [isRequestTransferOpen, setIsRequestTransferOpen] = useState(false);
  const [isRequestReturnOpen, setIsRequestReturnOpen] = useState(false);
  const [activeAsset, setActiveAsset] = useState(null);

  const openQrModal = (asset) => {
    setActiveAsset(asset);
    setIsQrOpen(true);
  };

  const openEditModal = (asset) => {
    setActiveAsset(asset);
    setIsEditOpen(true);
  };

  // Form states
  const [registerForm, setRegisterForm] = useState({
    name: '', tag: '', serial: '', category: '', brand: '', model: '', description: '',
    purchaseDate: '', purchaseCost: '', vendor: '', invoiceNumber: '', warrantyStart: '', warrantyEnd: '',
    location: '', condition: 'Excellent', shared: false, image: ''
  });

  const [bulkTransferData, setBulkTransferData] = useState({ employeeId: '', location: '', notes: '' });
  const [transferRequestForm, setTransferRequestForm] = useState({ targetEmployeeId: '', comments: '', location: '' });
  const [returnRequestNotes, setReturnRequestNotes] = useState('');

  // Simulate loading skeleton
  const triggerSearchLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    triggerSearchLoading();
  }, [searchQuery, selectedCategory, selectedDepartment, selectedCondition, selectedStatus, selectedLocation]);

  useEffect(() => {
    const registerParam = searchParams.get('openRegister');
    if (registerParam === 'true') {
      setIsRegisterOpen(true);
      searchParams.delete('openRegister');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  // Dynamic filter based on role permissions
  const getRoleFilteredAssets = () => {
    if (!user) return [];
    
    // 1. Employee: Can only see their assigned assets
    if (user.role === 'Employee') {
      return assets.filter(a => a.assignedTo === user.id);
    }
    
    // 2. Department Head: Can only see department assets
    if (user.role === 'Department Head') {
      return assets.filter(a => {
        if (!a.assignedTo) return false;
        const emp = employees.find(e => e.id === a.assignedTo);
        return emp?.department === user.department;
      });
    }

    // 3. Admin & Asset Manager: See all assets
    return assets;
  };

  const roleFilteredAssets = getRoleFilteredAssets();

  // Apply filters
  const filteredAssets = roleFilteredAssets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.serial && asset.serial.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.location && asset.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory ? asset.category === selectedCategory : true;
    
    const matchesDept = selectedDepartment ? (() => {
      if (!asset.assignedTo) return false;
      const emp = employees.find(e => e.id === asset.assignedTo);
      return emp?.department === selectedDepartment;
    })() : true;

    const matchesCondition = selectedCondition ? asset.condition === selectedCondition : true;
    const matchesStatus = selectedStatus ? asset.status === selectedStatus : true;
    const matchesLocation = selectedLocation ? asset.location.toLowerCase().includes(selectedLocation.toLowerCase()) : true;
    const matchesPurchaseDate = purchaseDateFilter ? asset.purchaseDate === purchaseDateFilter : true;

    return matchesSearch && matchesCategory && matchesDept && matchesCondition && matchesStatus && matchesLocation && matchesPurchaseDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Checkbox selections
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTags(paginatedAssets.map(a => a.tag));
    } else {
      setSelectedTags([]);
    }
  };

  const handleSelectTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Form Submissions
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.tag || !registerForm.category) {
      toast.error('Asset Name, Tag, and Category are required.');
      return;
    }

    const imgUrl = registerForm.image || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=200';
    const costVal = parseFloat(registerForm.purchaseCost) || 0;

    const res = registerAsset({
      ...registerForm,
      purchaseCost: costVal,
      image: imgUrl
    });

    if (res.success) {
      toast.success('Asset registered successfully.');
      setIsRegisterOpen(false);
      setRegisterForm({
        name: '', tag: '', serial: '', category: '', brand: '', model: '', description: '',
        purchaseDate: '', purchaseCost: '', vendor: '', invoiceNumber: '', warrantyStart: '', warrantyEnd: '',
        location: '', condition: 'Excellent', shared: false, image: ''
      });
    } else {
      toast.error(res.message);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateAsset(activeAsset.tag, activeAsset);
    toast.success('Asset details updated successfully.');
    setIsEditOpen(false);
    setActiveAsset(null);
  };

  // Request Forms
  const handleTransferRequestSubmit = (e) => {
    e.preventDefault();
    if (!transferRequestForm.targetEmployeeId) {
      toast.error('Please choose a target employee.');
      return;
    }
    const res = requestTransfer(activeAsset.tag, transferRequestForm.targetEmployeeId, transferRequestForm.comments, transferRequestForm.location);
    if (res.success) {
      toast.success('Transfer request submitted to Department Head.');
      setIsRequestTransferOpen(false);
      setTransferRequestForm({ targetEmployeeId: '', comments: '', location: '' });
      setActiveAsset(null);
    } else {
      toast.error(res.message);
    }
  };

  const handleReturnRequestSubmit = (e) => {
    e.preventDefault();
    const res = requestReturn(activeAsset.tag, returnRequestNotes, activeAsset.condition);
    if (res.success) {
      toast.success('Return request raised to Asset Manager.');
      setIsRequestReturnOpen(false);
      setReturnRequestNotes('');
      setActiveAsset(null);
    } else {
      toast.error(res.message);
    }
  };

  // Bulk operation handlers
  const handleBulkTransfer = (e) => {
    e.preventDefault();
    if (!bulkTransferData.employeeId) {
      toast.error('Select Employee.');
      return;
    }
    bulkTransferAssets(selectedTags, bulkTransferData.employeeId, bulkTransferData.location);
    setIsBulkTransferOpen(false);
    setSelectedTags([]);
  };

  const handleBulkStatusChange = (status) => {
    bulkUpdateAssetStatus(selectedTags, status);
    setSelectedTags([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedTags.length} assets?`)) {
      bulkDeleteAssets(selectedTags);
      setSelectedTags([]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedDepartment('');
    setSelectedCondition('');
    setSelectedStatus('');
    setSelectedLocation('');
    setPurchaseDateFilter('');
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {user.role === 'Employee' ? 'My Assigned Assets' : user.role === 'Department Head' ? 'Department Assets' : 'Asset Directory'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {user.role === 'Employee' ? 'Review your allocated corporate workstation assets and request services.' : 'Inspect, locate, and modify company hardware resources.'}
          </p>
        </div>
        
        {/* Register button hidden for Employees & Department Heads */}
        {user.role !== 'Employee' && user.role !== 'Department Head' && (
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Register Asset
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4" /> Advanced Filter Ledger
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Tag, Serial, Name..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>

          {/* Department filter hidden for Dept Heads (already locked to department) */}
          {user.role !== 'Department Head' && user.role !== 'Employee' && (
            <select
              value={selectedDepartment}
              onChange={(e) => { setSelectedDepartment(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          )}

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Lost">Lost</option>
            <option value="Disposed">Disposed</option>
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => { setSelectedCondition(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
          >
            <option value="">All Conditions</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>

          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer text-center"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs relative">
        {loading ? (
          /* Skeleton Loader Simulation */
          <div className="p-8 space-y-4">
            <div className="h-6 bg-slate-100 rounded w-1/4 animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4">
                  <div className="h-8 bg-slate-50 rounded col-span-1 animate-pulse" />
                  <div className="h-8 bg-slate-50 rounded col-span-2 animate-pulse" />
                  <div className="h-8 bg-slate-50 rounded col-span-1 animate-pulse" />
                  <div className="h-8 bg-slate-50 rounded col-span-1 animate-pulse" />
                  <div className="h-8 bg-slate-50 rounded col-span-1 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-450 uppercase tracking-wider">
                    {user.role !== 'Employee' && (
                      <th className="px-6 py-4 w-12 text-center">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedTags.length === paginatedAssets.length && paginatedAssets.length > 0}
                          className="rounded text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                      </th>
                    )}
                    <th className="px-6 py-4">Asset Code</th>
                    <th className="px-6 py-4">Asset Name</th>
                    <th className="px-6 py-4">Category</th>
                    {user.role !== 'Employee' && <th className="px-6 py-4">Assigned To</th>}
                    <th className="px-6 py-4">Condition</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-center">Passport QR</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedAssets.map((asset) => {
                    const assignedEmployee = employees.find(e => e.id === asset.assignedTo);
                    const categoryObj = categories.find(c => c.code === asset.category);

                    return (
                      <tr key={asset.tag} className="hover:bg-slate-50/50 transition-colors">
                        {user.role !== 'Employee' && (
                          <td className="px-6 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(asset.tag)}
                              onChange={() => handleSelectTag(asset.tag)}
                              className="rounded text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                            />
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <Link to={`/assets/${asset.tag}`} className="font-bold text-blue-600 hover:underline">
                            {asset.tag}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={asset.image} alt="" className="w-10 h-10 rounded-lg object-cover border shrink-0" />
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-800 block truncate max-w-xs">{asset.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold block">S/N: {asset.serial || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-655 font-semibold">{categoryObj?.name || asset.category}</td>
                        {user.role !== 'Employee' && (
                          <td className="px-6 py-4">
                            {assignedEmployee ? (
                              <div className="flex items-center gap-2">
                                <img src={assignedEmployee.photo} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                                <span className="font-semibold text-slate-700">{assignedEmployee.name}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium">Shared facility</span>
                            )}
                          </td>
                        )}
                        <td className="px-6 py-4"><ConditionBadge condition={asset.condition} /></td>
                        <td className="px-6 py-4"><StatusBadge status={asset.status} /></td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{asset.location}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openQrModal(asset)}
                            className="p-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-600 hover:text-blue-600 rounded-lg cursor-pointer transition-colors"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1 shrink-0">
                          {/* Standard Actions mapping based on active user role */}
                          {user.role === 'Employee' ? (
                            <>
                              <button
                                onClick={() => { setActiveAsset(asset); setIsRequestTransferOpen(true); }}
                                className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer"
                              >
                                Request Transfer
                              </button>
                              <button
                                onClick={() => { setActiveAsset(asset); setIsRequestReturnOpen(true); }}
                                className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer"
                              >
                                Return
                              </button>
                            </>
                          ) : (
                            <>
                              <Link to={`/assets/${asset.tag}`} className="inline-flex p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800" title="View details">
                                <Eye className="w-4 h-4" />
                              </Link>
                              {user.role !== 'Department Head' && (
                                <>
                                  <button onClick={() => openEditModal(asset)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800" title="Edit details">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => { if (confirm('Delete asset?')) deleteAsset(asset.tag); }} className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAssets.length === 0 && (
                    <tr>
                      <td colSpan={10} className="p-0">
                        {/* Custom Empty State */}
                        <div className="p-16 text-center space-y-3">
                          <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
                            <FolderOpen className="w-8 h-8" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-700">No assets registered yet</h3>
                          <p className="text-xs text-slate-450 max-w-xs mx-auto">Click register to populate the corporate hardware inventory directory.</p>
                          {user.role !== 'Employee' && user.role !== 'Department Head' && (
                            <button
                              onClick={() => setIsRegisterOpen(true)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-xl cursor-pointer shadow-xs inline-block"
                            >
                              Register Asset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-500">
                  Showing page {currentPage} of {totalPages} ({filteredAssets.length} assets)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Bulk Actions Bar (impending triggers) */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl z-40 flex items-center gap-6 border border-slate-800"
          >
            <div className="text-xs font-bold shrink-0">
              <span className="text-blue-400 font-extrabold">{selectedTags.length}</span> Selected
            </div>
            
            <div className="h-6 w-[1px] bg-slate-800 shrink-0" />
            
            <div className="flex gap-3 text-xs shrink-0">
              <button
                onClick={() => setIsBulkTransferOpen(true)}
                className="flex items-center gap-1.5 hover:text-blue-400 font-semibold cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" /> Transfer
              </button>
              <button
                onClick={() => handleBulkStatusChange('Maintenance')}
                className="flex items-center gap-1.5 hover:text-orange-400 font-semibold cursor-pointer"
              >
                <Wrench className="w-4 h-4" /> Maintenance
              </button>
              <button
                onClick={() => handleBulkStatusChange('Available')}
                className="flex items-center gap-1.5 hover:text-green-400 font-semibold cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Make Available
              </button>
              {user.role === 'Admin' && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 hover:text-red-400 font-bold cursor-pointer text-red-400"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
            
            <button
              onClick={() => setSelectedTags([])}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      {/* 1. REGISTER ASSET MODAL */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Asset" size="lg">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Asset Name *</label>
              <input
                type="text" required
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Asset Tag *</label>
              <input
                type="text" required
                value={registerForm.tag}
                onChange={(e) => setRegisterForm({ ...registerForm, tag: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
              <select
                required value={registerForm.category}
                onChange={(e) => setRegisterForm({ ...registerForm, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Cost ($)</label>
              <input
                type="number"
                value={registerForm.purchaseCost}
                onChange={(e) => setRegisterForm({ ...registerForm, purchaseCost: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Serial Number</label>
              <input
                type="text"
                value={registerForm.serial}
                onChange={(e) => setRegisterForm({ ...registerForm, serial: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Location Details</label>
            <input
              type="text"
              value={registerForm.location}
              onChange={(e) => setRegisterForm({ ...registerForm, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>
          <div className="flex items-center">
            <input
              id="sharedRegister"
              type="checkbox"
              checked={registerForm.shared}
              onChange={(e) => setRegisterForm({ ...registerForm, shared: e.target.checked })}
              className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
            />
            <label htmlFor="sharedRegister" className="ml-2 text-xs font-semibold text-slate-600 cursor-pointer">
              Shared / Bookable Resource
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={() => setIsRegisterOpen(false)} className="px-4 py-2 border rounded-xl text-sm cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm cursor-pointer">Register</button>
          </div>
        </form>
      </Modal>

      {/* 2. EDIT ASSET MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Asset">
        {activeAsset && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Asset Name</label>
              <input
                type="text" required
                value={activeAsset.name}
                onChange={(e) => setActiveAsset({ ...activeAsset, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                <input
                  type="text"
                  value={activeAsset.location}
                  onChange={(e) => setActiveAsset({ ...activeAsset, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Condition</label>
                <select
                  value={activeAsset.condition}
                  onChange={(e) => setActiveAsset({ ...activeAsset, condition: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 border rounded-xl text-sm cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm cursor-pointer">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>

      {/* 3. BULK TRANSFER MODAL */}
      <Modal isOpen={isBulkTransferOpen} onClose={() => setIsBulkTransferOpen(false)} title="Bulk Transfer Assets">
        <form onSubmit={handleBulkTransfer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Assign Selected to Employee *</label>
            <select
              required
              value={bulkTransferData.employeeId}
              onChange={(e) => setBulkTransferData({ ...bulkTransferData, employeeId: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm bg-white font-semibold"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">New Location</label>
            <input
              type="text"
              value={bulkTransferData.location}
              onChange={(e) => setBulkTransferData({ ...bulkTransferData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={() => setIsBulkTransferOpen(false)} className="px-4 py-2 border rounded-xl text-sm cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm cursor-pointer">Transfer Assets</button>
          </div>
        </form>
      </Modal>

      {/* 4. EMPLOYEE REQUEST TRANSFER MODAL */}
      <Modal isOpen={isRequestTransferOpen} onClose={() => setIsRequestTransferOpen(false)} title="Initiate Asset Transfer Request">
        {activeAsset && (
          <form onSubmit={handleTransferRequestSubmit} className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border text-xs text-slate-600">
              Transfer Asset: <span className="font-bold">{activeAsset.tag} - {activeAsset.name}</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Transfer to Employee *</label>
              <select
                required
                value={transferRequestForm.targetEmployeeId}
                onChange={(e) => setTransferRequestForm({ ...transferRequestForm, targetEmployeeId: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
              >
                <option value="">Select Target Employee</option>
                {employees.filter(e => e.id !== user.id).map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Target Location</label>
              <input
                type="text"
                value={transferRequestForm.location}
                onChange={(e) => setTransferRequestForm({ ...transferRequestForm, location: e.target.value })}
                placeholder="e.g. HQ Floor 3 Room 312"
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Justification Comments</label>
              <textarea
                value={transferRequestForm.comments}
                onChange={(e) => setTransferRequestForm({ ...transferRequestForm, comments: e.target.value })}
                rows="3"
                placeholder="Explain the operational rationale..."
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t">
              <button type="button" onClick={() => setIsRequestTransferOpen(false)} className="px-4 py-2 border rounded-xl text-sm cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm cursor-pointer">Submit Request</button>
            </div>
          </form>
        )}
      </Modal>

      {/* 5. EMPLOYEE RETURN MODAL */}
      <Modal isOpen={isRequestReturnOpen} onClose={() => setIsRequestReturnOpen(false)} title="Initiate Asset Return to Pool">
        {activeAsset && (
          <form onSubmit={handleReturnRequestSubmit} className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border text-xs text-slate-600">
              Return Asset: <span className="font-bold">{activeAsset.tag} - {activeAsset.name}</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">State Asset Condition</label>
              <select
                value={activeAsset.condition}
                onChange={(e) => setActiveAsset({ ...activeAsset, condition: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Return Notes / Reason</label>
              <textarea
                value={returnRequestNotes}
                onChange={(e) => setReturnRequestNotes(e.target.value)}
                rows="3"
                placeholder="Comments, accessories returned, or faults to report..."
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t">
              <button type="button" onClick={() => setIsRequestReturnOpen(false)} className="px-4 py-2 border rounded-xl text-sm cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm cursor-pointer">Initiate Return</button>
            </div>
          </form>
        )}
      </Modal>

      {/* 6. QR CODE DETAIL VIEW */}
      <Modal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} title="Asset Passport QR" size="sm">
        {activeAsset && (
          <div className="flex flex-col items-center py-4 text-center space-y-4">
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="w-40 h-40 bg-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center p-1">
                {/* Mock QR matrix */}
                <div className="absolute inset-1.5 grid grid-cols-4 gap-1 opacity-90">
                  <div className="border-[6px] border-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="border-[6px] border-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="border-[6px] border-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="bg-white rounded w-full h-full" />
                  <div className="bg-white/30 rounded w-full h-full" />
                </div>
              </div>
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-800">{activeAsset.tag}</p>
              <p className="text-slate-450">{activeAsset.name}</p>
            </div>
            <button
              onClick={() => toast.success('QR passport label downloaded.')}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs w-full py-2.5 rounded-xl cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download QR Label
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
};
export default Assets;
