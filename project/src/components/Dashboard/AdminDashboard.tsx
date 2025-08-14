import React, { useState } from 'react';
import { Users, Building, Calendar, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import EmployeeManagement from '../Employee/EmployeeManagement';
import DepartmentManagement from '../Department/DepartmentManagement';
import LeaveManagement from '../Leave/LeaveManagement';
import WeeklyRequests from '../Requests/WeeklyRequests';
import Reports from '../Reports/Reports';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

const AdminDashboard: React.FC = () => {
  const { employees, departments, leaveRequests, weeklyRequests } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  const totalSalary = employees.reduce((sum, emp) => sum + emp.totalSalary, 0);
  const pendingLeaves = leaveRequests.filter(req => req.status === 'pending').length;
  const pendingRequests = weeklyRequests.filter(req => req.status === 'pending').length;

  const departmentData = departments.map(dept => ({
    name: dept.name,
    employees: employees.filter(emp => emp.department === dept.name).length,
    salary: employees.filter(emp => emp.department === dept.name).reduce((sum, emp) => sum + emp.totalSalary, 0)
  }));

  const salaryData = departments.map(dept => ({
    name: dept.name,
    value: employees.filter(emp => emp.department === dept.name).reduce((sum, emp) => sum + emp.totalSalary, 0)
  }));

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'leaves', label: 'Leave Requests', icon: Calendar },
    { id: 'requests', label: 'Weekly Requests', icon: FileText },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeeManagement />;
      case 'departments':
        return <DepartmentManagement />;
      case 'leaves':
        return <LeaveManagement />;
      case 'requests':
        return <WeeklyRequests />;
      case 'reports':
        return <Reports />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Employees</p>
                    <p className="text-3xl font-bold">{employees.length}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Total Salary</p>
                    <p className="text-3xl font-bold">${totalSalary.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Pending Leaves</p>
                    <p className="text-3xl font-bold">{pendingLeaves}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-orange-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Pending Requests</p>
                    <p className="text-3xl font-bold">{pendingRequests}</p>
                  </div>
                  <FileText className="w-12 h-12 text-purple-200" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Employees by Department</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="employees" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Salary Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salaryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Department Overview</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {departmentData.map((dept, index) => (
                      <tr key={dept.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="font-medium">{dept.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{dept.employees}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${dept.salary.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${dept.employees > 0 ? (dept.salary / dept.employees).toLocaleString() : '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;