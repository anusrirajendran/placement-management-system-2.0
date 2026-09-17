import { sqliteDb } from './sqliteDb';
import { Student, Company, PlacementDrive, Application, DashboardStats } from '../types';

// Simulated minimal delay to trigger realistic UI loading states & indicators
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  students: {
    list: async (filters?: { search?: string; department?: string; status?: string }): Promise<Student[]> => {
      await delay();
      return sqliteDb.getStudents(filters?.search, filters?.department, filters?.status);
    },
    get: async (id: string): Promise<Student> => {
      await delay();
      const student = await sqliteDb.getStudentById(id);
      if (!student) throw new Error(`Student ${id} not found`);
      return student;
    },
    create: async (data: Omit<Student, 'id' | 'created_at'>): Promise<Student> => {
      await delay();
      return sqliteDb.createStudent(data);
    },
    update: async (id: string, data: Partial<Omit<Student, 'id' | 'created_at'>>): Promise<Student> => {
      await delay();
      return sqliteDb.updateStudent(id, data);
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      return sqliteDb.deleteStudent(id);
    },
  },

  companies: {
    list: async (filters?: { search?: string; industry?: string; location?: string }): Promise<Company[]> => {
      await delay();
      return sqliteDb.getCompanies(filters?.search, filters?.industry, filters?.location);
    },
    get: async (id: string): Promise<Company> => {
      await delay();
      const company = await sqliteDb.getCompanyById(id);
      if (!company) throw new Error(`Company ${id} not found`);
      return company;
    },
    create: async (data: Omit<Company, 'id' | 'created_at'>): Promise<Company> => {
      await delay();
      return sqliteDb.createCompany(data);
    },
    update: async (id: string, data: Partial<Omit<Company, 'id' | 'created_at'>>): Promise<Company> => {
      await delay();
      return sqliteDb.updateCompany(id, data);
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      return sqliteDb.deleteCompany(id);
    },
  },

  drives: {
    list: async (filters?: { search?: string; status?: string }): Promise<PlacementDrive[]> => {
      await delay();
      return sqliteDb.getDrives(filters?.search, filters?.status);
    },
    get: async (id: string): Promise<PlacementDrive> => {
      await delay();
      const drive = await sqliteDb.getDriveById(id);
      if (!drive) throw new Error(`Placement drive ${id} not found`);
      return drive;
    },
    create: async (data: Omit<PlacementDrive, 'id' | 'created_at'>): Promise<PlacementDrive> => {
      await delay();
      return sqliteDb.createDrive(data);
    },
    update: async (id: string, data: Partial<Omit<PlacementDrive, 'id' | 'created_at'>>): Promise<PlacementDrive> => {
      await delay();
      return sqliteDb.updateDrive(id, data);
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      return sqliteDb.deleteDrive(id);
    },
  },

  applications: {
    list: async (filters?: { search?: string; status?: string; driveId?: string }): Promise<Application[]> => {
      await delay();
      return sqliteDb.getApplications(filters?.search, filters?.status, filters?.driveId);
    },
    get: async (id: string): Promise<Application> => {
      await delay();
      const application = await sqliteDb.getApplicationById(id);
      if (!application) throw new Error(`Application ${id} not found`);
      return application;
    },
    create: async (data: Omit<Application, 'id' | 'created_at'>): Promise<Application> => {
      await delay();
      return sqliteDb.createApplication(data);
    },
    update: async (id: string, data: Partial<Omit<Application, 'id' | 'created_at'>>): Promise<Application> => {
      await delay();
      return sqliteDb.updateApplication(id, data);
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      return sqliteDb.deleteApplication(id);
    },
  },

  dashboard: {
    getStats: async (): Promise<DashboardStats> => {
      await delay(80);
      return sqliteDb.getDashboardStats();
    },
  },

  resetData: async (): Promise<void> => {
    await delay();
    return sqliteDb.resetData();
  },
};
