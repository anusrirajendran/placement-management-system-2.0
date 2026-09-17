import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StudentsView } from './components/StudentsView';
import { CompaniesView } from './components/CompaniesView';
import { DrivesView } from './components/DrivesView';
import { ApplicationsView } from './components/ApplicationsView';
import { ToastContainer } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { api } from './services/api';
import {
  ActiveModule,
  Student,
  Company,
  PlacementDrive,
  Application,
  DashboardStats,
  ToastMessage,
} from './types';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('placement_dark_mode') === 'true';
  });

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Filter application by drive shortcut
  const [selectedDriveFilter, setSelectedDriveFilter] = useState<string | undefined>(undefined);

  // Quick Action modal trigger
  const [openInitialAddModal, setOpenInitialAddModal] = useState<boolean>(false);

  // Delete Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    recordIdentifier: string;
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: 'Delete Confirmation',
    message: 'Are you sure you want to delete this record?',
    recordIdentifier: '',
    action: async () => {},
  });
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toggle Dark Mode
  const handleToggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem('placement_dark_mode', String(nextMode));
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toast Helper
  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load all records from SQLite backend
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [stu, comp, drv, app, stats] = await Promise.all([
        api.students.list(),
        api.companies.list(),
        api.drives.list(),
        api.applications.list(),
        api.dashboard.getStats(),
      ]);

      setStudents(stu);
      setCompanies(comp);
      setDrives(drv);
      setApplications(app);
      setDashboardStats(stats);
    } catch (err) {
      console.error('Failed to load records:', err);
      addToast('error', 'Failed to retrieve records from database.');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ================= STUDENT CRUD HANDLERS =================
  const handleAddStudent = async (data: Omit<Student, 'id' | 'created_at'>) => {
    try {
      await api.students.create(data);
      await loadAllData();
      addToast('success', 'Student added successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save the record. Please try again.';
      addToast('error', msg);
      throw err;
    }
  };

  const handleUpdateStudent = async (id: string, data: Partial<Omit<Student, 'id' | 'created_at'>>) => {
    try {
      await api.students.update(id, data);
      await loadAllData();
      addToast('success', 'Student details updated successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save the record. Please try again.';
      addToast('error', msg);
      throw err;
    }
  };

  const handleRequestDeleteStudent = (student: Student) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Student Record',
      message: 'Are you sure you want to delete this record?',
      recordIdentifier: `${student.name} (${student.register_number}) [${student.id}]`,
      action: async () => {
        setIsDeleting(true);
        try {
          await api.students.delete(student.id);
          await loadAllData();
          addToast('success', 'Student deleted successfully.');
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch {
          addToast('error', 'Failed to delete student record.');
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  // ================= COMPANY CRUD HANDLERS =================
  const handleAddCompany = async (data: Omit<Company, 'id' | 'created_at'>) => {
    try {
      await api.companies.create(data);
      await loadAllData();
      addToast('success', 'Record created successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save the record. Please try again.';
      addToast('error', msg);
      throw err;
    }
  };

  const handleUpdateCompany = async (id: string, data: Partial<Omit<Company, 'id' | 'created_at'>>) => {
    try {
      await api.companies.update(id, data);
      await loadAllData();
      addToast('success', 'Record updated successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save the record. Please try again.';
      addToast('error', msg);
      throw err;
    }
  };

  const handleRequestDeleteCompany = (company: Company) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Company Record',
      message: 'Are you sure you want to delete this record?',
      recordIdentifier: `${company.name} [${company.id}] • ${company.job_role}`,
      action: async () => {
        setIsDeleting(true);
        try {
          await api.companies.delete(company.id);
          await loadAllData();
          addToast('success', 'Record deleted successfully.');
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch {
          addToast('error', 'Failed to delete company record.');
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  // ================= PLACEMENT DRIVE CRUD HANDLERS =================
  const handleAddDrive = async (data: Omit<PlacementDrive, 'id' | 'created_at'>) => {
    try {
      await api.drives.create(data);
      await loadAllData();
      addToast('success', 'Record created successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save the record. Please try again.';
      addToast('error', msg);
      throw err;
    }
  };

  const handleUpdateDrive = async (id: string, data: Partial<Omit<PlacementDrive, 'id' | 'created_at'>>) => {
    try {
      await api.drives.update(id, data);
      await loadAllData();
      addToast('success', 'Record updated successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save the record. Please try again.';
      addToast('error', msg);
      throw err;
    }
  };

  const handleRequestDeleteDrive = (drive: PlacementDrive) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Placement Drive',
      message: 'Are you sure you want to delete this record?',
      recordIdentifier: `${drive.company_name} — ${drive.job_role} [${drive.id}]`,
      action: async () => {
        setIsDeleting(true);
        try {
          await api.drives.delete(drive.id);
          await loadAllData();
          addToast('success', 'Record deleted successfully.');
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch {
          addToast('error', 'Failed to delete placement drive.');
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  // ================= APPLICATION CRUD HANDLERS =================
  const handleAddApplication = async (data: Omit<Application, 'id' | 'created_at'>) => {
    try {
      await api.applications.create(data);
      await loadAllData();
      addToast('success', 'Record created successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save the record. Please try again.';
      addToast('error', msg);
      throw err;
    }
  };

  const handleUpdateApplication = async (id: string, data: Partial<Omit<Application, 'id' | 'created_at'>>) => {
    try {
      await api.applications.update(id, data);
      await loadAllData();
      addToast('success', 'Record updated successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save the record. Please try again.';
      addToast('error', msg);
      throw err;
    }
  };

  const handleRequestDeleteApplication = (app: Application) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Application',
      message: 'Are you sure you want to delete this record?',
      recordIdentifier: `App #${app.id}: ${app.student_name} → ${app.company_name} (${app.job_role})`,
      action: async () => {
        setIsDeleting(true);
        try {
          await api.applications.delete(app.id);
          await loadAllData();
          addToast('success', 'Record deleted successfully.');
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch {
          addToast('error', 'Failed to delete application.');
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  // Reset database confirmation
  const handleResetData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Demo Database',
      message: 'Are you sure you want to reset all records back to the default initial college seed data?',
      recordIdentifier: 'Students, Companies, Drives, and Applications will be re-seeded.',
      action: async () => {
        setIsDeleting(true);
        try {
          await api.resetData();
          await loadAllData();
          addToast('info', 'Database reset to initial demo state successfully.');
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch {
          addToast('error', 'Failed to reset database.');
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  // Quick Action Handler from Dashboard
  const handleQuickAction = (action: 'add-student' | 'add-company' | 'add-drive' | 'add-application') => {
    setOpenInitialAddModal(true);
    if (action === 'add-student') setActiveModule('students');
    else if (action === 'add-company') setActiveModule('companies');
    else if (action === 'add-drive') setActiveModule('drives');
    else if (action === 'add-application') setActiveModule('applications');
  };

  // Switch to applications view with prefiltered drive
  const handleViewApplicationsForDrive = (driveId: string) => {
    setSelectedDriveFilter(driveId);
    setActiveModule('applications');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod);
          setOpenInitialAddModal(false);
        }}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeModule === 'dashboard' && (
          <Dashboard
            stats={dashboardStats}
            isLoading={isLoading}
            onNavigate={(mod) => {
              setActiveModule(mod);
              setOpenInitialAddModal(false);
            }}
            onQuickAction={handleQuickAction}
          />
        )}

        {activeModule === 'students' && (
          <StudentsView
            students={students}
            isLoading={isLoading}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={async (id) => {
              await api.students.delete(id);
              await loadAllData();
            }}
            onRequestDelete={handleRequestDeleteStudent}
            openAddModalInitially={openInitialAddModal}
          />
        )}

        {activeModule === 'companies' && (
          <CompaniesView
            companies={companies}
            isLoading={isLoading}
            onAddCompany={handleAddCompany}
            onUpdateCompany={handleUpdateCompany}
            onDeleteCompany={async (id) => {
              await api.companies.delete(id);
              await loadAllData();
            }}
            onRequestDelete={handleRequestDeleteCompany}
            openAddModalInitially={openInitialAddModal}
          />
        )}

        {activeModule === 'drives' && (
          <DrivesView
            drives={drives}
            companies={companies}
            isLoading={isLoading}
            onAddDrive={handleAddDrive}
            onUpdateDrive={handleUpdateDrive}
            onDeleteDrive={async (id) => {
              await api.drives.delete(id);
              await loadAllData();
            }}
            onRequestDelete={handleRequestDeleteDrive}
            onViewApplicationsForDrive={handleViewApplicationsForDrive}
            openAddModalInitially={openInitialAddModal}
          />
        )}

        {activeModule === 'applications' && (
          <ApplicationsView
            applications={applications}
            students={students}
            drives={drives}
            isLoading={isLoading}
            onAddApplication={handleAddApplication}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={async (id) => {
              await api.applications.delete(id);
              await loadAllData();
            }}
            onRequestDelete={handleRequestDeleteApplication}
            filterDriveId={selectedDriveFilter}
            onClearDriveFilter={() => setSelectedDriveFilter(undefined)}
            openAddModalInitially={openInitialAddModal}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 College Placement Cell • Placement Management System</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              SQLite Database Active
            </span>
            <span>REST API v1.0</span>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        recordIdentifier={confirmModal.recordIdentifier}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        isLoading={isDeleting}
      />
    </div>
  );
}
