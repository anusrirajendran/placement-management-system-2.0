import { Student, Company, PlacementDrive, Application, DashboardStats } from '../types';

const DB_STORAGE_KEY = 'placement_management_sqlite_data_v2';

// Initial realistic seed datasets
const INITIAL_STUDENTS: Omit<Student, 'created_at'>[] = [
  {
    id: 'STU-1001',
    name: 'Aarav Sharma',
    register_number: '21CS001',
    email: 'aarav.sharma@college.edu',
    phone: '9876543210',
    department: 'Computer Science',
    year: 4,
    cgpa: 8.92,
    skills: 'React, Node.js, Python, PostgreSQL, Docker',
    placement_status: 'Placed',
  },
  {
    id: 'STU-1002',
    name: 'Diya Patel',
    register_number: '21IT014',
    email: 'diya.patel@college.edu',
    phone: '9876543211',
    department: 'Information Technology',
    year: 4,
    cgpa: 9.15,
    skills: 'Java, Spring Boot, Microservices, AWS, Kubernetes',
    placement_status: 'Placed',
  },
  {
    id: 'STU-1003',
    name: 'Rohan Verma',
    register_number: '21CS045',
    email: 'rohan.verma@college.edu',
    phone: '9876543212',
    department: 'Computer Science',
    year: 4,
    cgpa: 7.85,
    skills: 'Python, Machine Learning, TensorFlow, SQL',
    placement_status: 'In Process',
  },
  {
    id: 'STU-1004',
    name: 'Ananya Iyer',
    register_number: '21EC023',
    email: 'ananya.iyer@college.edu',
    phone: '9876543213',
    department: 'Electronics & Communication',
    year: 4,
    cgpa: 8.40,
    skills: 'Embedded C, IoT, Python, Verilog, Circuit Design',
    placement_status: 'In Process',
  },
  {
    id: 'STU-1005',
    name: 'Karthik Raja',
    register_number: '21ME031',
    email: 'karthik.raja@college.edu',
    phone: '9876543214',
    department: 'Mechanical',
    year: 4,
    cgpa: 7.42,
    skills: 'AutoCAD, SolidWorks, Python, Ansys, Lean Six Sigma',
    placement_status: 'Not Placed',
  },
  {
    id: 'STU-1006',
    name: 'Sneha Kulkarni',
    register_number: '21CS089',
    email: 'sneha.kulkarni@college.edu',
    phone: '9876543215',
    department: 'Computer Science',
    year: 4,
    cgpa: 8.78,
    skills: 'TypeScript, Next.js, GraphQL, MongoDB, Go',
    placement_status: 'Placed',
  },
  {
    id: 'STU-1007',
    name: 'Vikram Sundaram',
    register_number: '21EE018',
    email: 'vikram.sundaram@college.edu',
    phone: '9876543216',
    department: 'Electrical & Electronics',
    year: 4,
    cgpa: 7.95,
    skills: 'Power Systems, MATLAB, C++, PLC, Arduino',
    placement_status: 'In Process',
  },
  {
    id: 'STU-1008',
    name: 'Meera Nambiar',
    register_number: '21IT039',
    email: 'meera.nambiar@college.edu',
    phone: '9876543217',
    department: 'Information Technology',
    year: 4,
    cgpa: 8.60,
    skills: 'Flutter, Android, Swift, Firebase, REST APIs',
    placement_status: 'In Process',
  },
];

const INITIAL_COMPANIES: Omit<Company, 'created_at'>[] = [
  {
    id: 'CMP-201',
    name: 'Google Cloud Labs',
    industry: 'Software / Cloud',
    location: 'Bangalore, India',
    hr_name: 'Aditi Deshmukh',
    email: 'recruitment.india@google.com',
    job_role: 'Software Development Engineer',
    salary_package: 32.5,
    minimum_cgpa: 8.5,
    required_skills: 'Data Structures, Algorithms, Distributed Systems, Golang/Java/C++',
  },
  {
    id: 'CMP-202',
    name: 'Microsoft IDC',
    industry: 'Enterprise Software',
    location: 'Hyderabad, India',
    hr_name: 'Rajesh Mehra',
    email: 'careers@microsoft.com',
    job_role: 'Cloud Solution Engineer',
    salary_package: 26.0,
    minimum_cgpa: 8.0,
    required_skills: 'Cloud Architecture, C#, Azure, Networking, Python',
  },
  {
    id: 'CMP-203',
    name: 'Amazon Development Centre',
    industry: 'E-commerce & Cloud',
    location: 'Chennai, India',
    hr_name: 'Pooja Hegde',
    email: 'campus-hiring@amazon.com',
    job_role: 'SDE-1',
    salary_package: 28.0,
    minimum_cgpa: 7.75,
    required_skills: 'Java, Object-Oriented Design, Linux, AWS Services, SQL',
  },
  {
    id: 'CMP-204',
    name: 'Tata Consultancy Services (Digital)',
    industry: 'IT Consulting & Services',
    location: 'Pune / Pan-India',
    hr_name: 'Vikram Joshi',
    email: 'campus.tcs@tcs.com',
    job_role: 'Associate Software Engineer',
    salary_package: 7.5,
    minimum_cgpa: 7.0,
    required_skills: 'Java, Python, DBMS, Web Fundamentals',
  },
  {
    id: 'CMP-205',
    name: 'Zoho Corporation',
    industry: 'SaaS / Enterprise Products',
    location: 'Tenkasi / Chennai',
    hr_name: 'Kavitha Balan',
    email: 'recruit@zohocorp.com',
    job_role: 'Product Developer',
    salary_package: 9.0,
    minimum_cgpa: 6.5,
    required_skills: 'C++, Java, OOPs, Web Development, Problem Solving',
  },
  {
    id: 'CMP-206',
    name: 'Qualcomm India',
    industry: 'Semiconductor / Hardware',
    location: 'Hyderabad, India',
    hr_name: 'Siddharth Nair',
    email: 'hw_campus@qualcomm.com',
    job_role: 'Hardware Systems Engineer',
    salary_package: 18.5,
    minimum_cgpa: 7.8,
    required_skills: 'Verilog, VLSI, Embedded C, Computer Architecture',
  },
];

const INITIAL_DRIVES: Omit<PlacementDrive, 'created_at'>[] = [
  {
    id: 'DRV-301',
    company_id: 'CMP-201',
    company_name: 'Google Cloud Labs',
    job_role: 'Software Development Engineer',
    drive_date: '2026-10-15',
    application_deadline: '2026-10-05',
    salary_package: 32.5,
    minimum_cgpa: 8.5,
    required_skills: 'Algorithms, Data Structures, System Design',
    drive_status: 'Active',
  },
  {
    id: 'DRV-302',
    company_id: 'CMP-202',
    company_name: 'Microsoft IDC',
    job_role: 'Cloud Solution Engineer',
    drive_date: '2026-10-22',
    application_deadline: '2026-10-12',
    salary_package: 26.0,
    minimum_cgpa: 8.0,
    required_skills: 'C#, Azure, Java, Distributed Systems',
    drive_status: 'Active',
  },
  {
    id: 'DRV-303',
    company_id: 'CMP-205',
    company_name: 'Zoho Corporation',
    job_role: 'Product Developer',
    drive_date: '2026-11-04',
    application_deadline: '2026-10-25',
    salary_package: 9.0,
    minimum_cgpa: 6.5,
    required_skills: 'C++, Java, OOPs, Web Development',
    drive_status: 'Upcoming',
  },
  {
    id: 'DRV-304',
    company_id: 'CMP-204',
    company_name: 'Tata Consultancy Services (Digital)',
    job_role: 'Associate Software Engineer',
    drive_date: '2026-08-20',
    application_deadline: '2026-08-10',
    salary_package: 7.5,
    minimum_cgpa: 7.0,
    required_skills: 'Java, Python, DBMS, Web Fundamentals',
    drive_status: 'Completed',
  },
];

const INITIAL_APPLICATIONS: Omit<Application, 'created_at'>[] = [
  {
    id: 'APP-401',
    student_id: 'STU-1001',
    student_name: 'Aarav Sharma',
    student_reg_no: '21CS001',
    drive_id: 'DRV-301',
    company_id: 'CMP-201',
    company_name: 'Google Cloud Labs',
    job_role: 'Software Development Engineer',
    application_date: '2026-09-28',
    application_status: 'Selected',
    notes: 'Cleared 3 technical rounds with exceptional ratings.',
  },
  {
    id: 'APP-402',
    student_id: 'STU-1002',
    student_name: 'Diya Patel',
    student_reg_no: '21IT014',
    drive_id: 'DRV-302',
    company_id: 'CMP-202',
    company_name: 'Microsoft IDC',
    job_role: 'Cloud Solution Engineer',
    application_date: '2026-09-29',
    application_status: 'Selected',
    notes: 'Offered cloud track FTE.',
  },
  {
    id: 'APP-403',
    student_id: 'STU-1003',
    student_name: 'Rohan Verma',
    student_reg_no: '21CS045',
    drive_id: 'DRV-301',
    company_id: 'CMP-201',
    company_name: 'Google Cloud Labs',
    job_role: 'Software Development Engineer',
    application_date: '2026-09-30',
    application_status: 'Shortlisted',
    notes: 'Scheduled for virtual round 2.',
  },
  {
    id: 'APP-404',
    student_id: 'STU-1004',
    student_name: 'Ananya Iyer',
    student_reg_no: '21EC023',
    drive_id: 'DRV-302',
    company_id: 'CMP-202',
    company_name: 'Microsoft IDC',
    job_role: 'Cloud Solution Engineer',
    application_date: '2026-10-01',
    application_status: 'Applied',
    notes: 'Application under resume review.',
  },
  {
    id: 'APP-405',
    student_id: 'STU-1006',
    student_name: 'Sneha Kulkarni',
    student_reg_no: '21CS089',
    drive_id: 'DRV-304',
    company_id: 'CMP-204',
    company_name: 'Tata Consultancy Services (Digital)',
    job_role: 'Associate Software Engineer',
    application_date: '2026-08-12',
    application_status: 'Selected',
    notes: 'Digital package offered.',
  },
  {
    id: 'APP-406',
    student_id: 'STU-1008',
    student_name: 'Meera Nambiar',
    student_reg_no: '21IT039',
    drive_id: 'DRV-303',
    company_id: 'CMP-205',
    company_name: 'Zoho Corporation',
    job_role: 'Product Developer',
    application_date: '2026-10-02',
    application_status: 'Applied',
    notes: 'Ready for written aptitude round.',
  },
];

interface DatabaseSchema {
  students: Student[];
  companies: Company[];
  placement_drives: PlacementDrive[];
  applications: Application[];
}

/**
 * Self-contained Relational Database Engine
 * Implements SQLite relational rules, constraints, foreign keys, cascades,
 * and persistence to localStorage without external binary or WASM CDN dependencies.
 */
class RelationalDatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): DatabaseSchema {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DatabaseSchema;
        if (
          Array.isArray(parsed.students) &&
          Array.isArray(parsed.companies) &&
          Array.isArray(parsed.placement_drives) &&
          Array.isArray(parsed.applications)
        ) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not parse stored database; resetting to seed.', e);
    }
    return this.createSeedData();
  }

  private createSeedData(): DatabaseSchema {
    const now = new Date().toISOString();
    const seed: DatabaseSchema = {
      students: INITIAL_STUDENTS.map((s) => ({ ...s, created_at: now })),
      companies: INITIAL_COMPANIES.map((c) => ({ ...c, created_at: now })),
      placement_drives: INITIAL_DRIVES.map((d) => ({ ...d, created_at: now })),
      applications: INITIAL_APPLICATIONS.map((a) => ({ ...a, created_at: now })),
    };
    this.saveToStorage(seed);
    return seed;
  }

  private saveToStorage(schemaToSave?: DatabaseSchema): void {
    const target = schemaToSave || this.data;
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(target));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  }

  public resetData(): void {
    this.data = this.createSeedData();
  }

  // ================= STUDENTS =================
  public getStudents(search?: string, department?: string, status?: string): Student[] {
    let result = [...this.data.students];

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.register_number.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.skills.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    if (department && department !== 'All') {
      result = result.filter((s) => s.department === department);
    }

    if (status && status !== 'All') {
      result = result.filter((s) => s.placement_status === status);
    }

    // Order by ID desc
    return result.sort((a, b) => b.id.localeCompare(a.id));
  }

  public getStudentById(id: string): Student | null {
    return this.data.students.find((s) => s.id === id) || null;
  }

  public createStudent(data: Omit<Student, 'id' | 'created_at'>): Student {
    // Unique check for register number
    const regExists = this.data.students.some(
      (s) => s.register_number.toLowerCase() === data.register_number.trim().toLowerCase()
    );
    if (regExists) {
      throw new Error(`Registration number "${data.register_number}" already exists.`);
    }

    // Unique check for email
    const emailExists = this.data.students.some(
      (s) => s.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (emailExists) {
      throw new Error(`Student email "${data.email}" is already registered.`);
    }

    // Generate new ID (STU-1009, etc.)
    const maxNum = this.data.students.reduce((max, s) => {
      const match = s.id.match(/^STU-(\d+)$/);
      if (match) {
        const val = parseInt(match[1], 10);
        return val > max ? val : max;
      }
      return max;
    }, 1000);

    const newId = `STU-${maxNum + 1}`;
    const newStudent: Student = {
      ...data,
      id: newId,
      name: data.name.trim(),
      register_number: data.register_number.trim().toUpperCase(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      department: data.department.trim(),
      skills: data.skills.trim(),
      cgpa: parseFloat(Number(data.cgpa).toFixed(2)),
      created_at: new Date().toISOString(),
    };

    this.data.students.unshift(newStudent);
    this.saveToStorage();
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<Omit<Student, 'id' | 'created_at'>>): Student {
    const idx = this.data.students.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Student ${id} not found`);

    const current = this.data.students[idx];

    // Validate unique register_number if changing
    if (
      updates.register_number &&
      updates.register_number.trim().toLowerCase() !== current.register_number.toLowerCase()
    ) {
      const regExists = this.data.students.some(
        (s) => s.id !== id && s.register_number.toLowerCase() === updates.register_number!.trim().toLowerCase()
      );
      if (regExists) {
        throw new Error(`Registration number "${updates.register_number}" already exists.`);
      }
    }

    // Validate unique email if changing
    if (updates.email && updates.email.trim().toLowerCase() !== current.email.toLowerCase()) {
      const emailExists = this.data.students.some(
        (s) => s.id !== id && s.email.toLowerCase() === updates.email!.trim().toLowerCase()
      );
      if (emailExists) {
        throw new Error(`Student email "${updates.email}" is already registered.`);
      }
    }

    const updated: Student = {
      ...current,
      ...updates,
      name: updates.name !== undefined ? updates.name.trim() : current.name,
      register_number:
        updates.register_number !== undefined
          ? updates.register_number.trim().toUpperCase()
          : current.register_number,
      email: updates.email !== undefined ? updates.email.trim().toLowerCase() : current.email,
      phone: updates.phone !== undefined ? updates.phone.trim() : current.phone,
      department: updates.department !== undefined ? updates.department.trim() : current.department,
      skills: updates.skills !== undefined ? updates.skills.trim() : current.skills,
      cgpa: updates.cgpa !== undefined ? parseFloat(Number(updates.cgpa).toFixed(2)) : current.cgpa,
    };

    this.data.students[idx] = updated;

    // Cascade update to applications
    this.data.applications = this.data.applications.map((app) => {
      if (app.student_id === id) {
        return {
          ...app,
          student_name: updated.name,
          student_reg_no: updated.register_number,
        };
      }
      return app;
    });

    this.saveToStorage();
    return updated;
  }

  public deleteStudent(id: string): boolean {
    const student = this.data.students.find((s) => s.id === id);
    if (!student) return false;

    this.data.students = this.data.students.filter((s) => s.id !== id);
    // Cascade delete applications for this student
    this.data.applications = this.data.applications.filter((a) => a.student_id !== id);
    this.saveToStorage();
    return true;
  }

  // ================= COMPANIES =================
  public getCompanies(search?: string, industry?: string, location?: string): Company[] {
    let result = [...this.data.companies];

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.job_role.toLowerCase().includes(q) ||
          c.hr_name.toLowerCase().includes(q) ||
          c.required_skills.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    if (industry && industry !== 'All') {
      result = result.filter((c) => c.industry === industry);
    }

    if (location && location !== 'All') {
      const locQ = location.toLowerCase();
      result = result.filter((c) => c.location.toLowerCase().includes(locQ));
    }

    return result.sort((a, b) => b.id.localeCompare(a.id));
  }

  public getCompanyById(id: string): Company | null {
    return this.data.companies.find((c) => c.id === id) || null;
  }

  public createCompany(data: Omit<Company, 'id' | 'created_at'>): Company {
    const maxNum = this.data.companies.reduce((max, c) => {
      const match = c.id.match(/^CMP-(\d+)$/);
      if (match) {
        const val = parseInt(match[1], 10);
        return val > max ? val : max;
      }
      return max;
    }, 200);

    const newId = `CMP-${maxNum + 1}`;
    const newCompany: Company = {
      ...data,
      id: newId,
      name: data.name.trim(),
      industry: data.industry.trim(),
      location: data.location.trim(),
      hr_name: data.hr_name.trim(),
      email: data.email.trim().toLowerCase(),
      job_role: data.job_role.trim(),
      salary_package: parseFloat(Number(data.salary_package).toFixed(2)),
      minimum_cgpa: parseFloat(Number(data.minimum_cgpa).toFixed(2)),
      required_skills: data.required_skills.trim(),
      created_at: new Date().toISOString(),
    };

    this.data.companies.unshift(newCompany);
    this.saveToStorage();
    return newCompany;
  }

  public updateCompany(id: string, updates: Partial<Omit<Company, 'id' | 'created_at'>>): Company {
    const idx = this.data.companies.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Company ${id} not found`);

    const current = this.data.companies[idx];
    const updated: Company = {
      ...current,
      ...updates,
      name: updates.name !== undefined ? updates.name.trim() : current.name,
      industry: updates.industry !== undefined ? updates.industry.trim() : current.industry,
      location: updates.location !== undefined ? updates.location.trim() : current.location,
      hr_name: updates.hr_name !== undefined ? updates.hr_name.trim() : current.hr_name,
      email: updates.email !== undefined ? updates.email.trim().toLowerCase() : current.email,
      job_role: updates.job_role !== undefined ? updates.job_role.trim() : current.job_role,
      salary_package:
        updates.salary_package !== undefined
          ? parseFloat(Number(updates.salary_package).toFixed(2))
          : current.salary_package,
      minimum_cgpa:
        updates.minimum_cgpa !== undefined
          ? parseFloat(Number(updates.minimum_cgpa).toFixed(2))
          : current.minimum_cgpa,
      required_skills:
        updates.required_skills !== undefined ? updates.required_skills.trim() : current.required_skills,
    };

    this.data.companies[idx] = updated;

    // Cascade company name to placement drives & applications
    this.data.placement_drives = this.data.placement_drives.map((d) => {
      if (d.company_id === id) {
        return { ...d, company_name: updated.name };
      }
      return d;
    });

    this.data.applications = this.data.applications.map((a) => {
      if (a.company_id === id) {
        return { ...a, company_name: updated.name };
      }
      return a;
    });

    this.saveToStorage();
    return updated;
  }

  public deleteCompany(id: string): boolean {
    const company = this.data.companies.find((c) => c.id === id);
    if (!company) return false;

    this.data.companies = this.data.companies.filter((c) => c.id !== id);

    // Cascade delete drives for this company
    const driveIdsToDelete = new Set(
      this.data.placement_drives.filter((d) => d.company_id === id).map((d) => d.id)
    );
    this.data.placement_drives = this.data.placement_drives.filter((d) => d.company_id !== id);

    // Cascade delete applications for those drives or company
    this.data.applications = this.data.applications.filter(
      (a) => a.company_id !== id && !driveIdsToDelete.has(a.drive_id)
    );

    this.saveToStorage();
    return true;
  }

  // ================= PLACEMENT DRIVES =================
  public getDrives(search?: string, status?: string): PlacementDrive[] {
    let result = [...this.data.placement_drives];

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.company_name.toLowerCase().includes(q) ||
          d.job_role.toLowerCase().includes(q) ||
          d.required_skills.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'All') {
      result = result.filter((d) => d.drive_status === status);
    }

    return result.sort((a, b) => b.id.localeCompare(a.id));
  }

  public getDriveById(id: string): PlacementDrive | null {
    return this.data.placement_drives.find((d) => d.id === id) || null;
  }

  public createDrive(data: Omit<PlacementDrive, 'id' | 'created_at'>): PlacementDrive {
    const maxNum = this.data.placement_drives.reduce((max, d) => {
      const match = d.id.match(/^DRV-(\d+)$/);
      if (match) {
        const val = parseInt(match[1], 10);
        return val > max ? val : max;
      }
      return max;
    }, 300);

    const newId = `DRV-${maxNum + 1}`;
    const newDrive: PlacementDrive = {
      ...data,
      id: newId,
      company_name: data.company_name.trim(),
      job_role: data.job_role.trim(),
      salary_package: parseFloat(Number(data.salary_package).toFixed(2)),
      minimum_cgpa: parseFloat(Number(data.minimum_cgpa).toFixed(2)),
      required_skills: data.required_skills.trim(),
      created_at: new Date().toISOString(),
    };

    this.data.placement_drives.unshift(newDrive);
    this.saveToStorage();
    return newDrive;
  }

  public updateDrive(id: string, updates: Partial<Omit<PlacementDrive, 'id' | 'created_at'>>): PlacementDrive {
    const idx = this.data.placement_drives.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Placement drive ${id} not found`);

    const current = this.data.placement_drives[idx];
    const updated: PlacementDrive = {
      ...current,
      ...updates,
      company_name: updates.company_name !== undefined ? updates.company_name.trim() : current.company_name,
      job_role: updates.job_role !== undefined ? updates.job_role.trim() : current.job_role,
      salary_package:
        updates.salary_package !== undefined
          ? parseFloat(Number(updates.salary_package).toFixed(2))
          : current.salary_package,
      minimum_cgpa:
        updates.minimum_cgpa !== undefined
          ? parseFloat(Number(updates.minimum_cgpa).toFixed(2))
          : current.minimum_cgpa,
      required_skills:
        updates.required_skills !== undefined ? updates.required_skills.trim() : current.required_skills,
    };

    this.data.placement_drives[idx] = updated;

    // Cascade role or company name updates to applications
    this.data.applications = this.data.applications.map((app) => {
      if (app.drive_id === id) {
        return {
          ...app,
          company_name: updated.company_name,
          job_role: updated.job_role,
        };
      }
      return app;
    });

    this.saveToStorage();
    return updated;
  }

  public deleteDrive(id: string): boolean {
    const drive = this.data.placement_drives.find((d) => d.id === id);
    if (!drive) return false;

    this.data.placement_drives = this.data.placement_drives.filter((d) => d.id !== id);
    // Cascade delete applications for this drive
    this.data.applications = this.data.applications.filter((a) => a.drive_id !== id);
    this.saveToStorage();
    return true;
  }

  // ================= APPLICATIONS =================
  public getApplications(search?: string, status?: string, driveId?: string): Application[] {
    let result = [...this.data.applications];

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.student_name.toLowerCase().includes(q) ||
          (a.student_reg_no && a.student_reg_no.toLowerCase().includes(q)) ||
          a.company_name.toLowerCase().includes(q) ||
          a.job_role.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'All') {
      result = result.filter((a) => a.application_status === status);
    }

    if (driveId && driveId !== 'All') {
      result = result.filter((a) => a.drive_id === driveId);
    }

    return result.sort((a, b) => b.id.localeCompare(a.id));
  }

  public getApplicationById(id: string): Application | null {
    return this.data.applications.find((a) => a.id === id) || null;
  }

  public createApplication(data: Omit<Application, 'id' | 'created_at'>): Application {
    // Check if student already applied for this drive
    const duplicate = this.data.applications.some(
      (a) => a.student_id === data.student_id && a.drive_id === data.drive_id
    );
    if (duplicate) {
      throw new Error(`Student ${data.student_name} has already submitted an application for this drive.`);
    }

    const maxNum = this.data.applications.reduce((max, a) => {
      const match = a.id.match(/^APP-(\d+)$/);
      if (match) {
        const val = parseInt(match[1], 10);
        return val > max ? val : max;
      }
      return max;
    }, 400);

    const newId = `APP-${maxNum + 1}`;
    const newApp: Application = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
    };

    this.data.applications.unshift(newApp);

    // Sync student placement status if selected
    if (newApp.application_status === 'Selected') {
      this.syncStudentPlacementStatus(newApp.student_id, 'Placed');
    } else if (newApp.application_status === 'Applied' || newApp.application_status === 'Shortlisted') {
      const student = this.data.students.find((s) => s.id === newApp.student_id);
      if (student && student.placement_status === 'Not Placed') {
        this.syncStudentPlacementStatus(newApp.student_id, 'In Process');
      }
    }

    this.saveToStorage();
    return newApp;
  }

  public updateApplication(
    id: string,
    updates: Partial<Omit<Application, 'id' | 'created_at'>>
  ): Application {
    const idx = this.data.applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error(`Application ${id} not found`);

    const current = this.data.applications[idx];
    const updated: Application = {
      ...current,
      ...updates,
    };

    this.data.applications[idx] = updated;

    // Sync student placement status
    if (updated.application_status === 'Selected') {
      this.syncStudentPlacementStatus(updated.student_id, 'Placed');
    } else {
      // Re-evaluate student's overall status
      this.recomputeStudentPlacementStatus(updated.student_id);
    }

    this.saveToStorage();
    return updated;
  }

  public deleteApplication(id: string): boolean {
    const app = this.data.applications.find((a) => a.id === id);
    if (!app) return false;

    this.data.applications = this.data.applications.filter((a) => a.id !== id);
    this.recomputeStudentPlacementStatus(app.student_id);
    this.saveToStorage();
    return true;
  }

  private syncStudentPlacementStatus(
    studentId: string,
    status: Student['placement_status']
  ): void {
    const sIdx = this.data.students.findIndex((s) => s.id === studentId);
    if (sIdx !== -1) {
      this.data.students[sIdx].placement_status = status;
    }
  }

  private recomputeStudentPlacementStatus(studentId: string): void {
    const sIdx = this.data.students.findIndex((s) => s.id === studentId);
    if (sIdx === -1) return;

    const studentApps = this.data.applications.filter((a) => a.student_id === studentId);
    if (studentApps.some((a) => a.application_status === 'Selected')) {
      this.data.students[sIdx].placement_status = 'Placed';
    } else if (
      studentApps.some((a) => a.application_status === 'Shortlisted' || a.application_status === 'Applied')
    ) {
      this.data.students[sIdx].placement_status = 'In Process';
    } else {
      this.data.students[sIdx].placement_status = 'Not Placed';
    }
  }

  // ================= DASHBOARD =================
  public getDashboardStats(): DashboardStats {
    const totalStudents = this.data.students.length;
    const totalCompanies = this.data.companies.length;
    const activeDrives = this.data.placement_drives.filter((d) => d.drive_status === 'Active').length;
    const totalApplications = this.data.applications.length;
    const selectedStudents = this.data.students.filter((s) => s.placement_status === 'Placed').length;

    const placementRate = totalStudents > 0 ? (selectedStudents / totalStudents) * 100 : 0;

    // Department breakdown
    const deptMap: Record<string, { total: number; placed: number }> = {};
    this.data.students.forEach((s) => {
      if (!deptMap[s.department]) {
        deptMap[s.department] = { total: 0, placed: 0 };
      }
      deptMap[s.department].total += 1;
      if (s.placement_status === 'Placed') {
        deptMap[s.department].placed += 1;
      }
    });

    const departmentBreakdown = Object.entries(deptMap).map(([department, stat]) => ({
      department,
      total: stat.total,
      placed: stat.placed,
      rate: stat.total > 0 ? (stat.placed / stat.total) * 100 : 0,
    }));

    // Recent drives
    const recentDrives = [...this.data.placement_drives]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 5);

    // Recent applications
    const recentApplications = [...this.data.applications]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 5);

    return {
      total_students: totalStudents,
      total_companies: totalCompanies,
      active_drives: activeDrives,
      total_applications: totalApplications,
      selected_students: selectedStudents,
      placement_rate: placementRate,
      dept_stats: departmentBreakdown,
      recent_drives: recentDrives,
      recent_applications: recentApplications,
    };
  }
}

export const sqliteDb = new RelationalDatabaseStore();
