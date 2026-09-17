import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Calendar,
  Clock,
  Briefcase,
  AlertCircle,
  Building2,
  Filter,
  Users,
} from 'lucide-react';
import { PlacementDrive, Company } from '../types';

interface DrivesViewProps {
  drives: PlacementDrive[];
  companies: Company[];
  isLoading: boolean;
  onAddDrive: (data: Omit<PlacementDrive, 'id' | 'created_at'>) => Promise<void>;
  onUpdateDrive: (id: string, data: Partial<Omit<PlacementDrive, 'id' | 'created_at'>>) => Promise<void>;
  onDeleteDrive: (id: string) => Promise<void>;
  onRequestDelete: (drive: PlacementDrive) => void;
  onViewApplicationsForDrive?: (driveId: string) => void;
  openAddModalInitially?: boolean;
}

export const DrivesView: React.FC<DrivesViewProps> = ({
  drives,
  companies,
  isLoading,
  onAddDrive,
  onUpdateDrive,
  onRequestDelete,
  onViewApplicationsForDrive,
  openAddModalInitially = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(openAddModalInitially);
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null);
  const [viewingDrive, setViewingDrive] = useState<PlacementDrive | null>(null);

  // Form
  const [formData, setFormData] = useState({
    company_id: companies[0]?.id || '',
    company_name: companies[0]?.name || '',
    job_role: companies[0]?.job_role || 'Software Engineer',
    drive_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    application_deadline: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    salary_package: (companies[0]?.salary_package || 10.0).toString(),
    minimum_cgpa: (companies[0]?.minimum_cgpa || 7.0).toString(),
    required_skills: companies[0]?.required_skills || 'Problem Solving, Data Structures',
    drive_status: 'Upcoming' as 'Upcoming' | 'Active' | 'Completed',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered drives
  const filteredDrives = useMemo(() => {
    return drives.filter((d) => {
      const matchesSearch =
        d.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.job_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.required_skills.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || d.drive_status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [drives, searchTerm, selectedStatus]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingDrive(null);
    const defaultCompany = companies[0];
    setFormData({
      company_id: defaultCompany ? defaultCompany.id : '',
      company_name: defaultCompany ? defaultCompany.name : '',
      job_role: defaultCompany ? defaultCompany.job_role : '',
      drive_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      application_deadline: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      salary_package: defaultCompany ? defaultCompany.salary_package.toString() : '10.0',
      minimum_cgpa: defaultCompany ? defaultCompany.minimum_cgpa.toString() : '7.0',
      required_skills: defaultCompany ? defaultCompany.required_skills : 'Java, Python',
      drive_status: 'Upcoming',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (drive: PlacementDrive) => {
    setEditingDrive(drive);
    setFormData({
      company_id: drive.company_id,
      company_name: drive.company_name,
      job_role: drive.job_role,
      drive_date: drive.drive_date,
      application_deadline: drive.application_deadline,
      salary_package: drive.salary_package.toString(),
      minimum_cgpa: drive.minimum_cgpa.toString(),
      required_skills: drive.required_skills,
      drive_status: drive.drive_status,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Handle company select in form
  const handleCompanyChange = (companyId: string) => {
    const found = companies.find((c) => c.id === companyId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        company_id: found.id,
        company_name: found.name,
        job_role: found.job_role,
        salary_package: found.salary_package.toString(),
        minimum_cgpa: found.minimum_cgpa.toString(),
        required_skills: found.required_skills,
      }));
    } else {
      setFormData((prev) => ({ ...prev, company_id: companyId }));
    }
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.company_name.trim()) errors.company_name = 'Please specify company name.';
    if (!formData.job_role.trim()) errors.job_role = 'Please specify job role.';
    if (!formData.drive_date) errors.drive_date = 'Drive date is required.';
    if (!formData.application_deadline) errors.application_deadline = 'Application deadline is required.';

    if (formData.drive_date && formData.application_deadline) {
      if (formData.application_deadline > formData.drive_date) {
        errors.application_deadline = 'Deadline should be on or before the drive date.';
      }
    }

    const pkg = parseFloat(formData.salary_package);
    if (isNaN(pkg) || pkg <= 0) {
      errors.salary_package = 'Salary package must accept numeric values.';
    }

    const cgpa = parseFloat(formData.minimum_cgpa);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      errors.minimum_cgpa = 'CGPA must be between 0 and 10.';
    }

    if (!formData.required_skills.trim()) {
      errors.required_skills = 'Please enter required skills.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        company_id: formData.company_id || 'CMP-GEN',
        company_name: formData.company_name.trim(),
        job_role: formData.job_role.trim(),
        drive_date: formData.drive_date,
        application_deadline: formData.application_deadline,
        salary_package: parseFloat(Number(formData.salary_package).toFixed(2)),
        minimum_cgpa: parseFloat(Number(formData.minimum_cgpa).toFixed(2)),
        required_skills: formData.required_skills.trim(),
        drive_status: formData.drive_status,
      };

      if (editingDrive) {
        await onUpdateDrive(editingDrive.id, payload);
      } else {
        await onAddDrive(payload);
      }
      setIsFormModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save placement drive.';
      setFormErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="drives-module" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Placement Drives</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              {drives.length} Drives
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Schedule and supervise on-campus and virtual recruitment drives, eligibility cutoffs, and deadlines.
          </p>
        </div>

        {/* Schedule Drive Button */}
        <button
          id="add-drive-btn"
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Placement Drive</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="drive-search-input"
            type="text"
            placeholder="Search by company name, job role, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            id="drive-status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Drive Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Drives Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table id="drives-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Drive ID & Company</th>
                <th className="py-3.5 px-4">Job Role</th>
                <th className="py-3.5 px-4">Drive Date & Deadline</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Min CGPA</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                      <span>Loading placement drives...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDrives.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CalendarCheck className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-700 dark:text-slate-200">No placement drives found</p>
                      <p className="text-xs text-slate-400">
                        {searchTerm ? 'No drives matching search terms.' : 'Click "Schedule Placement Drive" to create one.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDrives.map((drive) => {
                  let statusBadge = (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Upcoming
                    </span>
                  );
                  if (drive.drive_status === 'Active') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                      </span>
                    );
                  } else if (drive.drive_status === 'Completed') {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        Completed
                      </span>
                    );
                  }

                  return (
                    <tr key={drive.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{drive.company_name}</span>
                        <span className="text-xs font-mono text-slate-400">{drive.id}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{drive.job_role}</span>
                        <div className="text-xs text-slate-400 truncate max-w-[180px]">{drive.required_skills}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>Drive: {drive.drive_date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>Deadline: {drive.application_deadline}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                        {drive.salary_package} LPA
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        ≥ {drive.minimum_cgpa}
                      </td>

                      <td className="py-3.5 px-4">{statusBadge}</td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {onViewApplicationsForDrive && (
                            <button
                              onClick={() => onViewApplicationsForDrive(drive.id)}
                              title="View applicants for this drive"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Users className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setViewingDrive(drive)}
                            title="View details"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(drive)}
                            title="Edit drive"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRequestDelete(drive)}
                            title="Delete drive"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Drive Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingDrive ? 'Update Placement Drive' : 'Schedule Placement Drive'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {editingDrive ? `Editing ${editingDrive.company_name} Drive (${editingDrive.id})` : 'Set drive dates, role, CTC package, and CGPA cutoffs'}
                </p>
              </div>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.general && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>{formErrors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              {/* Select Registered Company */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Registered Company <span className="text-rose-500">*</span>
                </label>
                {companies.length > 0 ? (
                  <select
                    id="drive-form-company-select"
                    value={formData.company_id}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.industry} - {c.location})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter company name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                )}
                {formErrors.company_name && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.company_name}</p>
                )}
              </div>

              {/* Job Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Designation / Role <span className="text-rose-500">*</span>
                </label>
                <input
                  id="drive-form-jobrole"
                  type="text"
                  placeholder="e.g. Associate Software Engineer"
                  value={formData.job_role}
                  onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-xl border ${
                    formErrors.job_role ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.job_role && <p className="text-[11px] text-rose-500 mt-1">{formErrors.job_role}</p>}
              </div>

              {/* Drive Date & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Recruitment Drive Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="drive-form-date"
                    type="date"
                    value={formData.drive_date}
                    onChange={(e) => setFormData({ ...formData, drive_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  {formErrors.drive_date && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.drive_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Application Deadline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="drive-form-deadline"
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  {formErrors.application_deadline && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.application_deadline}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Package */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Salary Package (LPA) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="drive-form-package"
                    type="number"
                    step="0.1"
                    value={formData.salary_package}
                    onChange={(e) => setFormData({ ...formData, salary_package: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  {formErrors.salary_package && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.salary_package}</p>
                  )}
                </div>

                {/* Min CGPA */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Minimum CGPA Cutoff <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="drive-form-cgpa"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.minimum_cgpa}
                    onChange={(e) => setFormData({ ...formData, minimum_cgpa: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  {formErrors.minimum_cgpa && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.minimum_cgpa}</p>
                  )}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Required Candidate Skills <span className="text-rose-500">*</span>
                </label>
                <input
                  id="drive-form-skills"
                  type="text"
                  placeholder="e.g. Data Structures, Algorithms, Python"
                  value={formData.required_skills}
                  onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.required_skills && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.required_skills}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Drive Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Upcoming', 'Active', 'Completed'] as const).map((st) => (
                    <label
                      key={st}
                      className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        formData.drive_status === st
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="drive_status"
                        value={st}
                        checked={formData.drive_status === st}
                        onChange={() => setFormData({ ...formData, drive_status: st })}
                        className="sr-only"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="save-drive-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? 'Saving...' : editingDrive ? 'Update Drive' : 'Schedule Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Drive Modal */}
      {viewingDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{viewingDrive.company_name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {viewingDrive.id} • {viewingDrive.job_role}
                  </p>
                </div>
              </div>
              <button onClick={() => setViewingDrive(null)} className="text-slate-400 hover:text-slate-600 p-1.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[11px] text-slate-400 font-semibold block">Drive Date</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-1">
                    {viewingDrive.drive_date}
                  </span>
                  <span className="text-[11px] text-slate-500">Deadline: {viewingDrive.application_deadline}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[11px] text-slate-400 font-semibold block">Package & Cutoff</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 block mt-1">
                    {viewingDrive.salary_package} LPA
                  </span>
                  <span className="text-[11px] text-slate-500">Min CGPA: {viewingDrive.minimum_cgpa}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[11px] text-slate-400 font-semibold block mb-1">Required Skills</span>
                <div className="flex flex-wrap gap-1">
                  {viewingDrive.required_skills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Current Drive Status</span>
                <span className="font-bold text-xs px-2.5 py-1 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs">
                  {viewingDrive.drive_status}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const d = viewingDrive;
                  setViewingDrive(null);
                  handleOpenEditModal(d);
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit drive
              </button>
              <button
                onClick={() => setViewingDrive(null)}
                className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
