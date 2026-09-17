import React from 'react';
import {
  Users,
  Building2,
  CalendarCheck,
  FileText,
  Award,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { DashboardStats, ActiveModule, PlacementDrive, Application } from '../types';

interface DashboardProps {
  stats: DashboardStats | null;
  isLoading: boolean;
  onNavigate: (module: ActiveModule) => void;
  onQuickAction: (action: 'add-student' | 'add-company' | 'add-drive' | 'add-application') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  isLoading,
  onNavigate,
  onQuickAction,
}) => {
  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading placement dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const safeStats = stats || {
    total_students: 0,
    total_companies: 0,
    active_drives: 0,
    total_applications: 0,
    selected_students: 0,
    placement_rate: 0,
    dept_stats: [],
    recent_drives: [],
    recent_applications: [],
  };

  return (
    <div id="dashboard-view" className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-700/60 text-xs font-semibold tracking-wide uppercase text-blue-200 mb-2 border border-blue-500/30">
            <span>Academic Year 2025–2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Placement Overview & Analytics</h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Real-time tracking of students, recruiting companies, campus recruitment drives, and interview offers.
          </p>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="flex flex-wrap gap-2">
          <button
            id="dash-quick-add-student"
            onClick={() => onQuickAction('add-student')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-blue-900 hover:bg-blue-50 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Student</span>
          </button>
          <button
            id="dash-quick-add-drive"
            onClick={() => onQuickAction('add-drive')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-700 hover:bg-blue-600 text-white border border-blue-400/30 transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Schedule Drive</span>
          </button>
        </div>
      </div>

      {/* 5 Core Required Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Students */}
        <div
          id="metric-total-students"
          onClick={() => onNavigate('students')}
          className="group cursor-pointer p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Students
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {safeStats.total_students}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Registered</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
            <span>Manage records</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Total Companies */}
        <div
          id="metric-total-companies"
          onClick={() => onNavigate('companies')}
          className="group cursor-pointer p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Companies
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {safeStats.total_companies}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Recruiters</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            <span>View recruiters</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Active Placement Drives */}
        <div
          id="metric-active-drives"
          onClick={() => onNavigate('drives')}
          className="group cursor-pointer p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Drives
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {safeStats.active_drives}
            </span>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live now</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span>View drives</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Total Applications */}
        <div
          id="metric-total-applications"
          onClick={() => onNavigate('applications')}
          className="group cursor-pointer p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Applications
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {safeStats.total_applications}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Submitted</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-medium">
            <span>Manage pipeline</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 5: Selected Students */}
        <div
          id="metric-selected-students"
          onClick={() => onNavigate('students')}
          className="group cursor-pointer p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Selected Students
            </span>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {safeStats.selected_students}
            </span>
            <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
              ({safeStats.placement_rate}% Placed)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-medium">
            <span>View placed list</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Progress & Department Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Rate Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Overall Placement Rate</span>
              </h2>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{safeStats.placement_rate}%</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {safeStats.selected_students} of {safeStats.total_students} graduating batch students have secured confirmed placement offers.
            </p>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, safeStats.placement_rate))}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block text-lg font-bold text-slate-900 dark:text-white">
                {safeStats.selected_students}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Placed</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block text-lg font-bold text-slate-900 dark:text-white">
                {Math.max(0, safeStats.total_students - safeStats.selected_students)}
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">In Pipeline</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block text-lg font-bold text-slate-900 dark:text-white">
                {safeStats.active_drives}
              </span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Active Drives</span>
            </div>
          </div>
        </div>

        {/* Department-wise Distribution */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Department Placement Ratio</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total registered vs placed students across engineering departments</p>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all students →
            </button>
          </div>

          <div className="space-y-3.5">
            {safeStats.dept_stats.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No department statistics available yet.</p>
            ) : (
              safeStats.dept_stats.map((dept) => {
                const pct = dept.total > 0 ? Math.round((dept.placed / dept.total) * 100) : 0;
                return (
                  <div key={dept.department} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{dept.department}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400">
                          {dept.placed}/{dept.total} placed
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 w-9 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Placement Drives & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Placement Drives */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Placement Drives</h2>
            </div>
            <button
              id="view-all-drives-link"
              onClick={() => onNavigate('drives')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all ({safeStats.recent_drives.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {safeStats.recent_drives.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No placement drives scheduled yet.</p>
            ) : (
              safeStats.recent_drives.slice(0, 4).map((drive) => {
                let statusBadge = (
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Upcoming
                  </span>
                );
                if (drive.drive_status === 'Active') {
                  statusBadge = (
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                    </span>
                  );
                } else if (drive.drive_status === 'Completed') {
                  statusBadge = (
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Completed
                    </span>
                  );
                }

                return (
                  <div key={drive.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        {drive.company_name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          {drive.job_role}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {drive.salary_package} LPA
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {statusBadge}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {drive.drive_date}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Applications Feed */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Student Applications</h2>
            </div>
            <button
              id="view-all-apps-link"
              onClick={() => onNavigate('applications')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all ({safeStats.recent_applications.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {safeStats.recent_applications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No student applications submitted yet.</p>
            ) : (
              safeStats.recent_applications.slice(0, 4).map((app) => {
                let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                if (app.application_status === 'Selected') {
                  badgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
                } else if (app.application_status === 'Shortlisted') {
                  badgeClass = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
                } else if (app.application_status === 'Rejected') {
                  badgeClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
                }

                return (
                  <div key={app.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {app.student_name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Applied to <span className="font-medium text-slate-700 dark:text-slate-300">{app.company_name}</span> ({app.job_role})
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${badgeClass}`}>
                        {app.application_status}
                      </span>
                      <span className="text-[11px] text-slate-400">{app.application_date}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
