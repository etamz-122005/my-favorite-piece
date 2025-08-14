import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Employee {
  id: number;
  name: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  hourlyRate: number;
  hoursWorked: number;
  totalSalary: number;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  employees: number;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

export interface WeeklyRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'completed';
  requestDate: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  employeeId?: number;
}

interface AppContextType {
  currentUser: User | null;
  employees: Employee[];
  departments: Department[];
  leaveRequests: LeaveRequest[];
  weeklyRequests: WeeklyRequest[];
  login: (email: string, password: string, role: 'admin' | 'employee') => boolean;
  logout: () => void;
  addEmployee: (employee: Omit<Employee, 'id' | 'totalSalary'>) => void;
  updateEmployee: (id: number, employee: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: number, department: Partial<Department>) => void;
  deleteDepartment: (id: number) => void;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'requestDate'>) => void;
  updateLeaveRequest: (id: number, status: 'approved' | 'rejected') => void;
  submitWeeklyRequest: (request: Omit<WeeklyRequest, 'id' | 'status' | 'requestDate'>) => void;
  updateWeeklyRequest: (id: number, status: 'reviewed' | 'completed') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialEmployees: Employee[] = [
  { id: 1, name: 'John Smith', department: 'IT', email: 'john.smith@softwify.com', phone: '+1-555-0101', address: '123 Tech St, Silicon Valley, CA', role: 'Senior Developer', hourlyRate: 75, hoursWorked: 160, totalSalary: 12000 },
  { id: 2, name: 'Sarah Johnson', department: 'HR', email: 'sarah.johnson@softwify.com', phone: '+1-555-0102', address: '456 Business Ave, New York, NY', role: 'HR Manager', hourlyRate: 65, hoursWorked: 160, totalSalary: 10400 },
  { id: 3, name: 'Michael Chen', department: 'IT', email: 'michael.chen@softwify.com', phone: '+1-555-0103', address: '789 Code Lane, Austin, TX', role: 'Full Stack Developer', hourlyRate: 70, hoursWorked: 168, totalSalary: 11760 },
  { id: 4, name: 'Emily Davis', department: 'Finance', email: 'emily.davis@softwify.com', phone: '+1-555-0104', address: '321 Money St, Chicago, IL', role: 'Financial Analyst', hourlyRate: 60, hoursWorked: 160, totalSalary: 9600 },
  { id: 5, name: 'David Wilson', department: 'Marketing', email: 'david.wilson@softwify.com', phone: '+1-555-0105', address: '654 Brand Blvd, Los Angeles, CA', role: 'Marketing Manager', hourlyRate: 68, hoursWorked: 155, totalSalary: 10540 },
  { id: 6, name: 'Lisa Anderson', department: 'Sales', email: 'lisa.anderson@softwify.com', phone: '+1-555-0106', address: '987 Sales Dr, Miami, FL', role: 'Sales Executive', hourlyRate: 55, hoursWorked: 170, totalSalary: 9350 },
  { id: 7, name: 'James Taylor', department: 'IT', email: 'james.taylor@softwify.com', phone: '+1-555-0107', address: '147 DevOps Way, Seattle, WA', role: 'DevOps Engineer', hourlyRate: 80, hoursWorked: 160, totalSalary: 12800 },
  { id: 8, name: 'Amanda Rodriguez', department: 'HR', email: 'amanda.rodriguez@softwify.com', phone: '+1-555-0108', address: '258 People St, Denver, CO', role: 'HR Specialist', hourlyRate: 50, hoursWorked: 160, totalSalary: 8000 },
  { id: 9, name: 'Robert Brown', department: 'Finance', email: 'robert.brown@softwify.com', phone: '+1-555-0109', address: '369 Accounting Ave, Boston, MA', role: 'Senior Accountant', hourlyRate: 62, hoursWorked: 160, totalSalary: 9920 },
  { id: 10, name: 'Jennifer Miller', department: 'Marketing', email: 'jennifer.miller@softwify.com', phone: '+1-555-0110', address: '741 Creative Ct, Portland, OR', role: 'Content Manager', hourlyRate: 58, hoursWorked: 160, totalSalary: 9280 },
  { id: 11, name: 'Christopher Lee', department: 'Sales', email: 'christopher.lee@softwify.com', phone: '+1-555-0111', address: '852 Revenue Rd, Phoenix, AZ', role: 'Sales Manager', hourlyRate: 72, hoursWorked: 165, totalSalary: 11880 },
  { id: 12, name: 'Michelle Garcia', department: 'Operations', email: 'michelle.garcia@softwify.com', phone: '+1-555-0112', address: '963 Process Pkwy, Dallas, TX', role: 'Operations Manager', hourlyRate: 66, hoursWorked: 160, totalSalary: 10560 },
  { id: 13, name: 'Kevin Martinez', department: 'IT', email: 'kevin.martinez@softwify.com', phone: '+1-555-0113', address: '159 Backend Blvd, San Francisco, CA', role: 'Backend Developer', hourlyRate: 73, hoursWorked: 160, totalSalary: 11680 },
  { id: 14, name: 'Rachel White', department: 'Design', email: 'rachel.white@softwify.com', phone: '+1-555-0114', address: '357 Design Dr, Nashville, TN', role: 'UI/UX Designer', hourlyRate: 64, hoursWorked: 160, totalSalary: 10240 },
  { id: 15, name: 'Daniel Thompson', department: 'Sales', email: 'daniel.thompson@softwify.com', phone: '+1-555-0115', address: '468 Client Circle, Atlanta, GA', role: 'Account Executive', hourlyRate: 59, hoursWorked: 162, totalSalary: 9558 }
];

const initialDepartments: Department[] = [
  { id: 1, name: 'IT', description: 'Information Technology Department', employees: 4 },
  { id: 2, name: 'HR', description: 'Human Resources Department', employees: 2 },
  { id: 3, name: 'Finance', description: 'Financial Management Department', employees: 2 },
  { id: 4, name: 'Marketing', description: 'Marketing and Brand Management', employees: 2 },
  { id: 5, name: 'Sales', description: 'Sales and Customer Relations', employees: 3 },
  { id: 6, name: 'Operations', description: 'Business Operations Management', employees: 1 },
  { id: 7, name: 'Design', description: 'Creative Design Department', employees: 1 }
];

const users: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@softwify.com', role: 'admin' },
  { id: 2, name: 'John Smith', email: 'john.smith@softwify.com', role: 'employee', employeeId: 1 },
  { id: 3, name: 'Sarah Johnson', email: 'sarah.johnson@softwify.com', role: 'employee', employeeId: 2 },
  { id: 4, name: 'Michael Chen', email: 'michael.chen@softwify.com', role: 'employee', employeeId: 3 }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [weeklyRequests, setWeeklyRequests] = useState<WeeklyRequest[]>([]);

  const login = (email: string, password: string, role: 'admin' | 'employee'): boolean => {
    // Simple authentication - in real app, this would be server-side
    const user = users.find(u => u.email === email && u.role === role);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addEmployee = (employee: Omit<Employee, 'id' | 'totalSalary'>) => {
    const newId = Math.max(...employees.map(e => e.id)) + 1;
    const totalSalary = employee.hourlyRate * employee.hoursWorked;
    setEmployees([...employees, { ...employee, id: newId, totalSalary }]);
  };

  const updateEmployee = (id: number, employeeUpdate: Partial<Employee>) => {
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        const updated = { ...emp, ...employeeUpdate };
        updated.totalSalary = updated.hourlyRate * updated.hoursWorked;
        return updated;
      }
      return emp;
    }));
  };

  const deleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const addDepartment = (department: Omit<Department, 'id'>) => {
    const newId = Math.max(...departments.map(d => d.id)) + 1;
    setDepartments([...departments, { ...department, id: newId }]);
  };

  const updateDepartment = (id: number, departmentUpdate: Partial<Department>) => {
    setDepartments(departments.map(dept => dept.id === id ? { ...dept, ...departmentUpdate } : dept));
  };

  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  const submitLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'status' | 'requestDate'>) => {
    const newId = Math.max(0, ...leaveRequests.map(r => r.id)) + 1;
    setLeaveRequests([...leaveRequests, {
      ...request,
      id: newId,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    }]);
  };

  const updateLeaveRequest = (id: number, status: 'approved' | 'rejected') => {
    setLeaveRequests(leaveRequests.map(req => req.id === id ? { ...req, status } : req));
  };

  const submitWeeklyRequest = (request: Omit<WeeklyRequest, 'id' | 'status' | 'requestDate'>) => {
    const newId = Math.max(0, ...weeklyRequests.map(r => r.id)) + 1;
    setWeeklyRequests([...weeklyRequests, {
      ...request,
      id: newId,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    }]);
  };

  const updateWeeklyRequest = (id: number, status: 'reviewed' | 'completed') => {
    setWeeklyRequests(weeklyRequests.map(req => req.id === id ? { ...req, status } : req));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      employees,
      departments,
      leaveRequests,
      weeklyRequests,
      login,
      logout,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      submitLeaveRequest,
      updateLeaveRequest,
      submitWeeklyRequest,
      updateWeeklyRequest
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};