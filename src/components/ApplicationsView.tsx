import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  User,
  Check,
  AlertTriangle,
  Briefcase,
  Filter,
} from 'lucide-react';
import { Application, Student, PlacementDrive } from '../types';

interface ApplicationsViewProps {
  applications: Application[];
  students: Student[];
  drives: PlacementDrive[];
  isLoading: boolean;
  onAddApplication: (data: Omit<Application, 'id' | 'created_at'>) => Promise<void>;
  onUpdateApplication: (id: string, data: Partial<Omit<Application, 'id' | 'created_at'>>) => Promise<void>;
  onDeleteApplication: (id: string) => Promise<void>;
  onRequestDelete: (app: Application) => void;
  filterDriveId?: string;
  onClearDriveFilter?: () => void;
  openAddModalInitially?: boolean;
}

const STATUS_OPTIONS: Application['application_status'][] = ['Applied', 'Shortlisted', 'Selected', 'Rejected'];

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  students,
  drives,
  isLoading,
  onAddApplication,
  onUpdateApplication,
  onRequestDelete,
  filterDriveId,
  onClearDriveFilter,
  openAddModalInitially = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDriveId, setSelectedDriveId] = useState(filterDriveId || 'All');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(openAddModalInitially);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  // Form State
  const defaultStudent = students[0];
  const defaultDrive = drives.find((d) => d.drive_status === 'Active') || drives[0];

  const [formData, setFormData] = useState({
    student_id: defaultStudent?.id || '',
    drive_id: defaultDrive?.id || '',
    application_date: new Date().toISOString().split('T')[0],
    application_status: 'Applied' as Application['application_status'],
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected student & drive objects for eligibility verification in form
  const currentSelectedStudent = students.find((s) => s.id === formData.student_id);
  const currentSelectedDrive = drives.find((d) => d.id === formData.drive_id);

  const isEligible = useMemo(() => {
    if (!currentSelectedStudent || !currentSelectedDrive) return true;
    return currentSelectedStudent.cgpa >= currentSelectedDrive.minimum_cgpa;
  }, [currentSelectedStudent, currentSelectedDrive]);

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((a) => {
      const matchesSearch =
        a.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.student_reg_no && a.student_reg_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        a.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.job_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || a.application_status === selectedStatus;
      const matchesDrive = selectedDriveId === 'All' || a.drive_id === selectedDriveId;

      return matchesSearch && matchesStatus && matchesDrive;
    });
  }, [applications, searchTerm, selectedStatus, selectedDriveId]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingApp(null);
    const s = students[0];
    const d = drives.find((drv) => drv.drive_status === 'Active') || drives[0];

    setFormData({
      student_id: s?.id || '',
      drive_id: d?.id || '',
      application_date: new Date().toISOString().split('T')[0],
      application_status: 'Applied',
      notes: '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (app: Application) => {
    setEditingApp(app);
    setFormData({
      student_id: app.student_id,
      drive_id: app.drive_id,
      application_date: app.application_date,
      application_status: app.application_status,
      notes: app.notes || '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Quick Status Change on Table
  const handleQuickStatusChange = async (app: Application, newStatus: Application['application_status']) => {
    if (app.application_status === newStatus) return;
    try {
      await onUpdateApplication(app.id, { application_status: newStatus });
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.student_id) errors.student_id = 'Please select a student.';
    if (!formData.drive_id) errors.drive_id = 'Please select a placement drive.';
    if (!formData.application_date) errors.application_date = 'Please choose application date.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const student = students.find((s) => s.id === formData.student_id);
    const drive = drives.find((d) => d.id === formData.drive_id);

    if (!student || !drive) {
      setFormErrors({ general: 'Selected student or placement drive was not found.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        student_id: student.id,
        student_name: student.name,
        student_reg_no: student.register_number,
        drive_id: drive.id,
        company_id: drive.company_id,
        company_name: drive.company_name,
        job_role: drive.job_role,
        application_date: formData.application_date,
        application_status: formData.application_status,
        notes: formData.notes.trim(),
      };

      if (editingApp) {
        await onUpdateApplication(editingApp.id, payload);
      } else {
        await onAddApplication(payload);
      }
      setIsFormModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save application.';
      setFormErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="applications-module" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Application Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
              {applications.length} Submissions
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track student candidacies, shortlist candidate pools, record interview outcomes, and confirm placement offers.
          </p>
        </div>

        {/* Create Application Button */}
        <button
          id="add-application-btn"
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Filter by Drive Notice */}
      {filterDriveId && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-100">
          <span>
            Filtering applications for Placement Drive: <strong>{filterDriveId}</strong>
          </span>
          {onClearDriveFilter && (
            <button onClick={onClearDriveFilter} className="underline font-semibold hover:text-blue-700">
              Show all drives
            </button>
          )}
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="app-search-input"
            type="text"
            placeholder="Search by student name, reg number, company, or role..."
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

        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <select
            id="app-status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Placement Drive Filter */}
        <div className="w-full sm:w-auto">
          <select
            id="app-drive-filter"
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Placement Drives</option>
            {drives.map((d) => (
              <option key={d.id} value={d.id}>
                {d.company_name} ({d.job_role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table id="applications-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Recruiter & Role</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4">Status & Quick Update</th>
                <th className="py-3.5 px-4">Interview Notes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                      <span>Loading applications...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-700 dark:text-slate-200">No applications found</p>
                      <p className="text-xs text-slate-400">
                        {searchTerm ? 'No applications match your query.' : 'Click "New Application" to register a candidate.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                  if (app.application_status === 'Selected') {
                    badgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
                  } else if (app.application_status === 'Shortlisted') {
                    badgeClass = 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
                  } else if (app.application_status === 'Rejected') {
                    badgeClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
                  }

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 dark:text-slate-400 font-bold">
                        {app.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{app.student_name}</span>
                        <span className="text-xs font-mono text-slate-400">
                          {app.student_reg_no || app.student_id}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {app.company_name}
                        </span>
                        <span className="text-xs text-slate-500">{app.job_role}</span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                        {app.application_date}
                      </td>

                      {/* Quick Status selector */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <select
                            id={`status-select-${app.id}`}
                            value={app.application_status}
                            onChange={(e) =>
                              handleQuickStatusChange(app, e.target.value as Application['application_status'])
                            }
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-hidden focus:ring-1 ${badgeClass}`}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[220px]">
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {app.notes || '—'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingApp(app)}
                            title="View details"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(app)}
                            title="Edit application"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRequestDelete(app)}
                            title="Delete application"
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

      {/* Add / Edit Application Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingApp ? 'Update Application Details' : 'Submit New Candidate Application'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {editingApp ? `Application ID: ${editingApp.id}` : 'Enroll a registered student into a recruitment drive'}
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
              {/* Select Student */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Student <span className="text-rose-500">*</span>
                </label>
                <select
                  id="app-form-student-select"
                  value={formData.student_id}
                  disabled={Boolean(editingApp)}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:opacity-60"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.register_number}) • {s.department} • CGPA: {s.cgpa.toFixed(2)}
                    </option>
                  ))}
                </select>
                {formErrors.student_id && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.student_id}</p>
                )}
              </div>

              {/* Select Drive */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Placement Drive <span className="text-rose-500">*</span>
                </label>
                <select
                  id="app-form-drive-select"
                  value={formData.drive_id}
                  disabled={Boolean(editingApp)}
                  onChange={(e) => setFormData({ ...formData, drive_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:opacity-60"
                >
                  {drives.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.company_name} — {d.job_role} ({d.salary_package} LPA, Min CGPA: {d.minimum_cgpa}) [
                      {d.drive_status}]
                    </option>
                  ))}
                </select>
                {formErrors.drive_id && <p className="text-[11px] text-rose-500 mt-1">{formErrors.drive_id}</p>}
              </div>

              {/* CGPA Eligibility Indicator Banner */}
              {currentSelectedStudent && currentSelectedDrive && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    isEligible
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 text-emerald-800 dark:text-emerald-200'
                      : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 text-amber-800 dark:text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isEligible ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold block">
                        {isEligible ? 'Candidate Meets Cutoff Criteria' : 'Cutoff CGPA Warning'}
                      </span>
                      <span>
                        Student CGPA: <strong>{currentSelectedStudent.cgpa.toFixed(2)}</strong> vs Required Cutoff:{' '}
                        <strong>{currentSelectedDrive.minimum_cgpa}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Application Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Application Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="app-form-date"
                    type="date"
                    value={formData.application_date}
                    onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  {formErrors.application_date && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.application_date}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Application Status
                  </label>
                  <select
                    id="app-form-status-select"
                    value={formData.application_status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        application_status: e.target.value as Application['application_status'],
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes / Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interview Remarks / Officer Notes
                </label>
                <textarea
                  id="app-form-notes"
                  rows={3}
                  placeholder="e.g. Cleared online screening assessment, awaiting technical interview scheduling..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
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
                  id="save-application-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? 'Saving...' : editingApp ? 'Update Application' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Application Modal */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Application #{viewingApp.id}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Applied on {viewingApp.application_date}
                  </p>
                </div>
              </div>
              <button onClick={() => setViewingApp(null)} className="text-slate-400 hover:text-slate-600 p-1.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3">
                <User className="w-8 h-8 text-blue-500 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block">Applicant</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewingApp.student_name}</span>
                  <span className="text-xs text-slate-500 block">
                    Register No: {viewingApp.student_reg_no || viewingApp.student_id}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block">Placement Drive</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewingApp.company_name}</span>
                  <span className="text-xs text-slate-500 block">
                    Role: {viewingApp.job_role} (Drive ID: {viewingApp.drive_id})
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Interview Status</span>
                <span className="font-bold text-xs px-3 py-1 rounded-md bg-blue-600 text-white shadow-xs">
                  {viewingApp.application_status}
                </span>
              </div>

              {viewingApp.notes && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1">
                    Officer Notes & Remarks
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{viewingApp.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const a = viewingApp;
                  setViewingApp(null);
                  handleOpenEditModal(a);
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit application
              </button>
              <button
                onClick={() => setViewingApp(null)}
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
