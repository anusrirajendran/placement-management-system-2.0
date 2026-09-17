export interface Student {
  id: string;
  name: string;
  register_number: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  cgpa: number;
  skills: string;
  placement_status: 'Not Placed' | 'In Process' | 'Placed';
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  hr_name: string;
  email: string;
  job_role: string;
  salary_package: number; // in LPA
  minimum_cgpa: number;
  required_skills: string;
  created_at: string;
}

export interface PlacementDrive {
  id: string;
  company_id: string;
  company_name: string;
  job_role: string;
  drive_date: string; // YYYY-MM-DD
  application_deadline: string; // YYYY-MM-DD
  salary_package: number; // in LPA
  minimum_cgpa: number;
  required_skills: string;
  drive_status: 'Upcoming' | 'Active' | 'Completed';
  created_at: string;
}

export interface Application {
  id: string;
  student_id: string;
  student_name: string;
  student_reg_no?: string;
  drive_id: string;
  company_id: string;
  company_name: string;
  job_role: string;
  application_date: string; // YYYY-MM-DD
  application_status: 'Applied' | 'Shortlisted' | 'Selected' | 'Rejected';
  notes?: string;
  created_at: string;
}

export interface DashboardStats {
  total_students: number;
  total_companies: number;
  active_drives: number;
  total_applications: number;
  selected_students: number;
  placement_rate: number;
  dept_stats: { department: string; total: number; placed: number }[];
  recent_drives: PlacementDrive[];
  recent_applications: Application[];
}

export type ActiveModule = 'dashboard' | 'students' | 'companies' | 'drives' | 'applications';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
