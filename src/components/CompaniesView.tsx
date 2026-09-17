import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  MapPin,
  Mail,
  UserCheck,
  Briefcase,
  DollarSign,
  GraduationCap,
  Sparkles,
  AlertCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Company } from '../types';

interface CompaniesViewProps {
  companies: Company[];
  isLoading: boolean;
  onAddCompany: (data: Omit<Company, 'id' | 'created_at'>) => Promise<void>;
  onUpdateCompany: (id: string, data: Partial<Omit<Company, 'id' | 'created_at'>>) => Promise<void>;
  onDeleteCompany: (id: string) => Promise<void>;
  onRequestDelete: (company: Company) => void;
  openAddModalInitially?: boolean;
}

const INDUSTRIES = [
  'All',
  'Software / Cloud',
  'Enterprise Software',
  'E-commerce & Cloud',
  'IT Consulting & Services',
  'SaaS / Enterprise Products',
  'Semiconductor / Hardware',
  'FinTech',
];

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  isLoading,
  onAddCompany,
  onUpdateCompany,
  onRequestDelete,
  openAddModalInitially = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(openAddModalInitially);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Software / Cloud',
    location: '',
    hr_name: '',
    email: '',
    job_role: '',
    salary_package: '12.0',
    minimum_cgpa: '7.5',
    required_skills: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Locations derived from companies
  const locations = useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      const loc = c.location.split(',')[0].trim();
      if (loc) set.add(loc);
    });
    return Array.from(set);
  }, [companies]);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.job_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.hr_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.required_skills.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;
      const matchesLocation = selectedLocation === 'All' || c.location.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesIndustry && matchesLocation;
    });
  }, [companies, searchTerm, selectedIndustry, selectedLocation]);

  // Open Create
  const handleOpenCreateModal = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      industry: 'Software / Cloud',
      location: '',
      hr_name: '',
      email: '',
      job_role: '',
      salary_package: '12.0',
      minimum_cgpa: '7.5',
      required_skills: '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit
  const handleOpenEditModal = (c: Company) => {
    setEditingCompany(c);
    setFormData({
      name: c.name,
      industry: c.industry,
      location: c.location,
      hr_name: c.hr_name,
      email: c.email,
      job_role: c.job_role,
      salary_package: c.salary_package.toString(),
      minimum_cgpa: c.minimum_cgpa.toString(),
      required_skills: c.required_skills,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Please enter company name.';
    if (!formData.industry.trim()) errors.industry = 'Please select industry.';
    if (!formData.location.trim()) errors.location = 'Please enter location.';
    if (!formData.hr_name.trim()) errors.hr_name = 'Please enter HR or recruiter name.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Please enter a valid recruiter email.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.job_role.trim()) errors.job_role = 'Please specify hiring job role.';

    const pkg = parseFloat(formData.salary_package);
    if (isNaN(pkg) || pkg <= 0) {
      errors.salary_package = 'Salary package must accept numeric values.';
    }

    const cgpa = parseFloat(formData.minimum_cgpa);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      errors.minimum_cgpa = 'CGPA must be between 0 and 10.';
    }

    if (!formData.required_skills.trim()) {
      errors.required_skills = 'Please enter required candidate skills.';
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
        name: formData.name.trim(),
        industry: formData.industry,
        location: formData.location.trim(),
        hr_name: formData.hr_name.trim(),
        email: formData.email.trim(),
        job_role: formData.job_role.trim(),
        salary_package: parseFloat(Number(formData.salary_package).toFixed(2)),
        minimum_cgpa: parseFloat(Number(formData.minimum_cgpa).toFixed(2)),
        required_skills: formData.required_skills.trim(),
      };

      if (editingCompany) {
        await onUpdateCompany(editingCompany.id, payload);
      } else {
        await onAddCompany(payload);
      }
      setIsFormModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save the company record.';
      setFormErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="companies-module" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Company Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              {companies.length} Recruiters
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain hiring company profiles, job designations, compensation packages, and eligibility criteria.
          </p>
        </div>

        {/* Add Company Button */}
        <button
          id="add-company-btn"
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="company-search-input"
            type="text"
            placeholder="Search by company name, job role, recruiter, or skills..."
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

        {/* Industry Filter */}
        <div className="w-full sm:w-auto">
          <select
            id="company-industry-filter"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind === 'All' ? 'All Industries' : ind}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="w-full sm:w-auto">
          <select
            id="company-location-filter"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-500'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Table View"
            className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-500'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Companies Content */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
          <span>Loading recruiting company records...</span>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 dark:text-slate-200">No companies found</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Click "Add Company" to register a new recruiter.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              id={`company-card-${company.id}`}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {company.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                      {company.name}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{company.industry}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 block">
                      {company.salary_package} LPA
                    </span>
                    <span className="text-[10px] text-slate-400">CTC Package</span>
                  </div>
                </div>

                <div className="space-y-2 py-2 text-xs border-y border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{company.job_role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Min CGPA: <strong className="text-slate-900 dark:text-white">{company.minimum_cgpa}</strong></span>
                  </div>
                </div>

                {/* Skills chips */}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {company.required_skills.split(',').slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                    {company.required_skills.split(',').length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{company.required_skills.split(',').length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                  HR: {company.hr_name}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    id={`view-company-${company.id}`}
                    onClick={() => setViewingCompany(company)}
                    title="View details"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    id={`edit-company-${company.id}`}
                    onClick={() => handleOpenEditModal(company)}
                    title="Edit company"
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    id={`delete-company-${company.id}`}
                    onClick={() => onRequestDelete(company)}
                    title="Delete company"
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table id="companies-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Company ID & Name</th>
                  <th className="py-3.5 px-4">Industry & Location</th>
                  <th className="py-3.5 px-4">Job Role</th>
                  <th className="py-3.5 px-4">Package</th>
                  <th className="py-3.5 px-4">Min CGPA</th>
                  <th className="py-3.5 px-4">HR Contact</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{c.name}</span>
                      <span className="text-xs font-mono text-slate-400">{c.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{c.industry}</div>
                      <div className="text-xs text-slate-400">{c.location}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{c.job_role}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">{c.salary_package} LPA</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{c.minimum_cgpa}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <div>{c.hr_name}</div>
                      <div>{c.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewingCompany(c)} className="p-1.5 text-slate-500 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenEditModal(c)} className="p-1.5 text-slate-500 hover:text-amber-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onRequestDelete(c)} className="p-1.5 text-slate-500 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Company Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingCompany ? 'Update Company Details' : 'Register Recruiting Company'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {editingCompany ? `Editing ${editingCompany.name} (${editingCompany.id})` : 'Enter company profile, recruiter information, and hiring criteria'}
                </p>
              </div>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.general && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>{formErrors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="company-form-name"
                    type="text"
                    placeholder="e.g. Amazon Technologies"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.name && <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>}
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industry Sector <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="company-form-industry"
                    type="text"
                    placeholder="e.g. Software / Cloud"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location / Office <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="company-form-location"
                    type="text"
                    placeholder="e.g. Bangalore, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.location ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.location && <p className="text-[11px] text-rose-500 mt-1">{formErrors.location}</p>}
                </div>

                {/* HR Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    HR / Recruiter Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="company-form-hr"
                    type="text"
                    placeholder="e.g. Priya Sen"
                    value={formData.hr_name}
                    onChange={(e) => setFormData({ ...formData, hr_name: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.hr_name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.hr_name && <p className="text-[11px] text-rose-500 mt-1">{formErrors.hr_name}</p>}
                </div>
              </div>

              {/* Recruiter Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recruiter Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="company-form-email"
                  type="email"
                  placeholder="e.g. recruiter@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-xl border ${
                    formErrors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.email && <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Job Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Role <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="company-form-jobrole"
                    type="text"
                    placeholder="e.g. SDE-1"
                    value={formData.job_role}
                    onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.job_role ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.job_role && <p className="text-[11px] text-rose-500 mt-1">{formErrors.job_role}</p>}
                </div>

                {/* Salary Package (LPA) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Package (LPA) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="company-form-salary"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 14.5"
                    value={formData.salary_package}
                    onChange={(e) => setFormData({ ...formData, salary_package: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.salary_package ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.salary_package && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.salary_package}</p>
                  )}
                </div>

                {/* Minimum CGPA */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min CGPA <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="company-form-mincgpa"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="e.g. 7.5"
                    value={formData.minimum_cgpa}
                    onChange={(e) => setFormData({ ...formData, minimum_cgpa: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-xl border ${
                      formErrors.minimum_cgpa ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.minimum_cgpa && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.minimum_cgpa}</p>
                  )}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Required Skills <span className="text-rose-500">*</span>
                </label>
                <input
                  id="company-form-skills"
                  type="text"
                  placeholder="e.g. Java, Spring Boot, MySQL, Data Structures"
                  value={formData.required_skills}
                  onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-xl border ${
                    formErrors.required_skills ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.required_skills && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.required_skills}</p>
                )}
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
                  id="save-company-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? 'Saving...' : editingCompany ? 'Update Company' : 'Save Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Company Modal */}
      {viewingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{viewingCompany.name}</h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {viewingCompany.industry} • {viewingCompany.id}
                  </p>
                </div>
              </div>
              <button onClick={() => setViewingCompany(null)} className="text-slate-400 hover:text-slate-600 p-1.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[11px] text-slate-400 font-semibold block">Hiring Role & CTC</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-1">
                    {viewingCompany.job_role}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                    {viewingCompany.salary_package} LPA
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[11px] text-slate-400 font-semibold block">Eligibility</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-1">
                    Min CGPA: {viewingCompany.minimum_cgpa}
                  </span>
                  <span className="text-slate-500 text-xs">{viewingCompany.location}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-semibold block">HR & Recruiter Contact</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{viewingCompany.hr_name}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{viewingCompany.email}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Required Candidate Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingCompany.required_skills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const c = viewingCompany;
                  setViewingCompany(null);
                  handleOpenEditModal(c);
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit company profile
              </button>
              <button
                onClick={() => setViewingCompany(null)}
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
