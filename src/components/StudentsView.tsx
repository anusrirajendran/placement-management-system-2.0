import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Sparkles,
  Filter,
} from 'lucide-react';
import { Student } from '../types';

interface StudentsViewProps {
  students: Student[];
  isLoading: boolean;
  onAddStudent: (data: Omit<Student, 'id' | 'created_at'>) => Promise<void>;
  onUpdateStudent: (id: string, data: Partial<Omit<Student, 'id' | 'created_at'>>) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onRequestDelete: (student: Student) => void;
  openAddModalInitially?: boolean;
}

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical',
  'Mechanical',
  'Civil',
];

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  isLoading,
  onAddStudent,
  onUpdateStudent,
  onRequestDelete,
  openAddModalInitially = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(openAddModalInitially);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Form inputs state
  const [formData, setFormData] = useState({
    name: '',
    register_number: '',
    email: '',
    phone: '',
    department: DEPARTMENTS[0],
    year: 4,
    cgpa: '8.00',
    skills: '',
    placement_status: 'Not Placed' as 'Not Placed' | 'In Process' | 'Placed',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered Students list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.register_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDept === 'All' || s.department === selectedDept;
      const matchesStatus = selectedStatus === 'All' || s.placement_status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [students, searchTerm, selectedDept, selectedStatus]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      register_number: '',
      email: '',
      phone: '',
      department: DEPARTMENTS[0],
      year: 4,
      cgpa: '8.00',
      skills: '',
      placement_status: 'Not Placed',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      register_number: student.register_number,
      email: student.email,
      phone: student.phone,
      department: student.department,
      year: student.year,
      cgpa: student.cgpa.toString(),
      skills: student.skills,
      placement_status: student.placement_status,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Please enter the student name.';
    }

    if (!formData.register_number.trim()) {
      errors.register_number = 'Please enter the register number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Please enter a valid email.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email.';
    }

    const phoneRegex = /^[0-9+\s-]{10,15}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid 10-digit phone number.';
    }

    const cgpaNum = parseFloat(formData.cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      errors.cgpa = 'CGPA must be between 0 and 10.';
    }

    if (!formData.skills.trim()) {
      errors.skills = 'Please enter at least one skill.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        register_number: formData.register_number.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        year: Number(formData.year),
        cgpa: parseFloat(Number(formData.cgpa).toFixed(2)),
        skills: formData.skills.trim(),
        placement_status: formData.placement_status,
      };

      if (editingStudent) {
        await onUpdateStudent(editingStudent.id, payload);
      } else {
        await onAddStudent(payload);
      }
      setIsFormModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to save the record. Please try again.';
      setFormErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="students-module" className="space-y-6 animate-in fade-in duration-300">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Student Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
              {students.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Register and manage student profiles, academic CGPA scores, technical skills, and placement statuses.
          </p>
        </div>

        {/* Add Student Button */}
        <button
          id="add-student-btn"
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="student-search-input"
            type="text"
            placeholder="Search by student name, register number, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            id="student-dept-filter"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Placement Status Filter */}
        <div>
          <select
            id="student-status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Placement Statuses</option>
            <option value="Not Placed">Not Placed</option>
            <option value="In Process">In Process</option>
            <option value="Placed">Placed</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table id="students-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Student ID & Reg No</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Department & Year</th>
                <th className="py-3.5 px-4">CGPA</th>
                <th className="py-3.5 px-4">Skills</th>
                <th className="py-3.5 px-4">Placement Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                      <span>Loading student records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      <p className="font-medium text-slate-600 dark:text-slate-300">No students found</p>
                      <p className="text-xs text-slate-400">
                        {searchTerm || selectedDept !== 'All' || selectedStatus !== 'All'
                          ? 'Try clearing your search query or filters.'
                          : 'Click "Add Student" above to create your first student record.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  let statusBadge = (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Not Placed
                    </span>
                  );
                  if (student.placement_status === 'Placed') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Placed
                      </span>
                    );
                  } else if (student.placement_status === 'In Process') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        In Process
                      </span>
                    );
                  }

                  // CGPA styling
                  let cgpaBadge = 'text-slate-900 dark:text-white font-bold';
                  if (student.cgpa >= 8.5) {
                    cgpaBadge = 'text-emerald-600 dark:text-emerald-400 font-bold';
                  } else if (student.cgpa >= 7.5) {
                    cgpaBadge = 'text-blue-600 dark:text-blue-400 font-bold';
                  }

                  return (
                    <tr
                      key={student.id}
                      id={`student-row-${student.id}`}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white block">
                          {student.register_number}
                        </span>
                        <span className="text-[11px] text-slate-400">{student.id}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{student.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{student.email}</span>
                          <span>•</span>
                          <span>{student.phone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{student.department}</div>
                        <div className="text-xs text-slate-400">Year {student.year} (Batch 2026)</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-base ${cgpaBadge}`}>{student.cgpa.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 block">/ 10.0</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {student.skills
                            .split(',')
                            .slice(0, 3)
                            .map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium truncate"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          {student.skills.split(',').length > 3 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{student.skills.split(',').length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">{statusBadge}</td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            id={`view-student-${student.id}`}
                            onClick={() => setViewingStudent(student)}
                            title="View student profile details"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            id={`edit-student-${student.id}`}
                            onClick={() => handleOpenEditModal(student)}
                            title="Edit student details"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            id={`delete-student-${student.id}`}
                            onClick={() => onRequestDelete(student)}
                            title="Delete student record"
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

      {/* Add / Edit Student Modal */}
      {isFormModalOpen && (
        <div
          id="student-form-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          role="dialog"
        >
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingStudent ? 'Update Student Details' : 'Add New Student'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {editingStudent ? `Editing record for ${editingStudent.id}` : 'Fill in the student academic and contact profile'}
                </p>
              </div>
              <button
                id="close-student-form-btn"
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* General Form Error Banner */}
            {formErrors.general && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{formErrors.general}</span>
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="student-form-name"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.name
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2`}
                  />
                  {formErrors.name && <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>}
                </div>

                {/* Register Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Register Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="student-form-reg-no"
                    type="text"
                    placeholder="e.g. 21CS042"
                    value={formData.register_number}
                    onChange={(e) => setFormData({ ...formData, register_number: e.target.value.toUpperCase() })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.register_number
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 uppercase`}
                  />
                  {formErrors.register_number && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.register_number}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    College Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="student-form-email"
                    type="email"
                    placeholder="e.g. rahul@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.email
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2`}
                  />
                  {formErrors.email && <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="student-form-phone"
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.phone
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2`}
                  />
                  {formErrors.phone && <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="student-form-department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="student-form-year"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year (Final)</option>
                  </select>
                </div>

                {/* CGPA */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cumulative CGPA <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="student-form-cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="0.00 to 10.00"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.cgpa
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2`}
                  />
                  {formErrors.cgpa && <p className="text-[11px] text-rose-500 mt-1">{formErrors.cgpa}</p>}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skills (comma separated) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="student-form-skills"
                  type="text"
                  placeholder="e.g. Java, Python, React, SQL, Cloud Computing"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-xl border ${
                    formErrors.skills
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2`}
                />
                {formErrors.skills && <p className="text-[11px] text-rose-500 mt-1">{formErrors.skills}</p>}
              </div>

              {/* Placement Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Placement Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Not Placed', 'In Process', 'Placed'] as const).map((status) => (
                    <label
                      key={status}
                      className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        formData.placement_status === status
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="placement_status"
                        value={status}
                        checked={formData.placement_status === status}
                        onChange={() => setFormData({ ...formData, placement_status: status })}
                        className="sr-only"
                      />
                      <span>{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  id="cancel-student-form-btn"
                  onClick={() => setIsFormModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="save-student-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Student...</span>
                    </>
                  ) : (
                    <span>{editingStudent ? 'Update Details' : 'Save Student'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Details Modal */}
      {viewingStudent && (
        <div
          id="student-view-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          role="dialog"
        >
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {viewingStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{viewingStudent.name}</h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {viewingStudent.register_number} • {viewingStudent.id}
                  </p>
                </div>
              </div>
              <button
                id="close-view-student-modal"
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[11px] text-slate-400 font-semibold block flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Department
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                    {viewingStudent.department}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[11px] text-slate-400 font-semibold block flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Academic Standing
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                    Year {viewingStudent.year} (CGPA: {viewingStudent.cgpa.toFixed(2)})
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{viewingStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{viewingStudent.phone}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Skills & Proficiencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingStudent.skills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Current Placement Status</span>
                <span className="font-bold text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-xs">
                  {viewingStudent.placement_status}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                id="edit-from-view-modal-btn"
                onClick={() => {
                  const s = viewingStudent;
                  setViewingStudent(null);
                  handleOpenEditModal(s);
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit this student
              </button>
              <button
                onClick={() => setViewingStudent(null)}
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
