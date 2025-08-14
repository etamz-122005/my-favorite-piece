import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileText, Download, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

const Reports: React.FC = () => {
  const { employees, departments, leaveRequests, weeklyRequests } = useApp();
  const [activeReport, setActiveReport] = useState('overview');

  const totalSalary = employees.reduce((sum, emp) => sum + emp.totalSalary, 0);
  const averageSalary = totalSalary / employees.length;

  const departmentData = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept.name);
    return {
      name: dept.name,
      employees: deptEmployees.length,
      totalSalary: deptEmployees.reduce((sum, emp) => sum + emp.totalSalary, 0),
      avgSalary: deptEmployees.length > 0 ? deptEmployees.reduce((sum, emp) => sum + emp.totalSalary, 0) / deptEmployees.length : 0
    };
  });

  const leaveStatusData = [
    { name: 'Pending', value: leaveRequests.filter(req => req.status === 'pending').length },
    { name: 'Approved', value: leaveRequests.filter(req => req.status === 'approved').length },
    { name: 'Rejected', value: leaveRequests.filter(req => req.status === 'rejected').length }
  ];

  const requestStatusData = [
    { name: 'Pending', value: weeklyRequests.filter(req => req.status === 'pending').length },
    { name: 'Reviewed', value: weeklyRequests.filter(req => req.status === 'reviewed').length },
    { name: 'Completed', value: weeklyRequests.filter(req => req.status === 'completed').length }
  ];

  const salaryRangeData = [
    { range: '$0-5K', count: employees.filter(emp => emp.totalSalary <= 5000).length },
    { range: '$5K-8K', count: employees.filter(emp => emp.totalSalary > 5000 && emp.totalSalary <= 8000).length },
    { range: '$8K-10K', count: employees.filter(emp => emp.totalSalary > 8000 && emp.totalSalary <= 10000).length },
    { range: '$10K-12K', count: employees.filter(emp => emp.totalSalary > 10000 && emp.totalSalary <= 12000).length },
    { range: '$12K+', count: employees.filter(emp => emp.totalSalary > 12000).length }
  ];

  const monthlyTrends = [
    { month: 'Jan', employees: 12, salary: totalSalary * 0.8, leaves: 3, requests: 5 },
    { month: 'Feb', employees: 13, salary: totalSalary * 0.85, leaves: 5, requests: 7 },
    { month: 'Mar', employees: 14, salary: totalSalary * 0.9, leaves: 4, requests: 6 },
    { month: 'Apr', employees: 15, salary: totalSalary * 0.95, leaves: 6, requests: 8 },
    { month: 'May', employees: 15, salary: totalSalary, leaves: leaveRequests.length, requests: 9 },
    { month: 'Jun', employees: 15, salary: totalSalary, leaves: leaveRequests.length, requests: weeklyRequests.length }
  ];

  const generateReport = () => {
    const reportData = {
      date: new Date().toLocaleDateString(),
      totalEmployees: employees.length,
      totalDepartments: departments.length,
      totalSalary,
      averageSalary,
      pendingLeaves: leaveRequests.filter(req => req.status === 'pending').length,
      pendingRequests: weeklyRequests.filter(req => req.status === 'pending').length,
      departments: departmentData
    };

    const csvContent = `SOFTWIFY - Company Report
Generated: ${reportData.date}

OVERVIEW
Total Employees: ${reportData.totalEmployees}
Total Departments: ${reportData.totalDepartments}
Total Monthly Salary: $${reportData.totalSalary.toLocaleString()}
Average Salary: $${Math.round(reportData.averageSalary).toLocaleString()}
Pending Leaves: ${reportData.pendingLeaves}
Pending Requests: ${reportData.pendingRequests}

DEPARTMENT BREAKDOWN
${departmentData.map(dept => 
  `${dept.name}: ${dept.employees} employees, $${dept.totalSalary.toLocaleString()} total salary`
).join('\n')}
`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOFTWIFY-Report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const reportTabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'departments', label: 'Departments', icon: Users },
    { id: 'leaves', label: 'Leaves', icon: Calendar },
    { id: 'requests', label: 'Requests', icon: FileText }
  ];

  const renderContent = () => {
    switch (activeReport) {
      case 'payroll':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Total Payroll</h3>
                <p className="text-3xl font-bold">${totalSalary.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Average Salary</h3>
                <p className="text-3xl font-bold">${Math.round(averageSalary).toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Highest Salary</h3>
                <p className="text-3xl font-bold">${Math.max(...employees.map(emp => emp.totalSalary)).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Salary Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salaryRangeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Department Payroll</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalSalary"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      
      case 'departments':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                      <tr key={dept.name}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="font-medium">{dept.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{dept.employees}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${dept.totalSalary.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${Math.round(dept.avgSalary).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Department Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employees" fill="#3B82F6" name="Employees" />
                  <Bar dataKey="avgSalary" fill="#10B981" name="Avg Salary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'leaves':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Pending Leaves</h3>
                <p className="text-3xl font-bold">{leaveRequests.filter(req => req.status === 'pending').length}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Approved Leaves</h3>
                <p className="text-3xl font-bold">{leaveRequests.filter(req => req.status === 'approved').length}</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Rejected Leaves</h3>
                <p className="text-3xl font-bold">{leaveRequests.filter(req => req.status === 'rejected').length}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Leave Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leaveStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leaveStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'requests':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Pending Requests</h3>
                <p className="text-3xl font-bold">{weeklyRequests.filter(req => req.status === 'pending').length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Reviewed Requests</h3>
                <p className="text-3xl font-bold">{weeklyRequests.filter(req => req.status === 'reviewed').length}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Completed Requests</h3>
                <p className="text-3xl font-bold">{weeklyRequests.filter(req => req.status === 'completed').length}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Request Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={requestStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {requestStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Employees</p>
                    <p className="text-3xl font-bold">{employees.length}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Total Payroll</p>
                    <p className="text-3xl font-bold">${totalSalary.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Pending Leaves</p>
                    <p className="text-3xl font-bold">{leaveRequests.filter(req => req.status === 'pending').length}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-orange-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Active Requests</p>
                    <p className="text-3xl font-bold">{weeklyRequests.filter(req => req.status !== 'completed').length}</p>
                  </div>
                  <FileText className="w-12 h-12 text-purple-200" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">6-Month Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="employees" stroke="#3B82F6" strokeWidth={2} name="Employees" />
                  <Line type="monotone" dataKey="leaves" stroke="#EF4444" strokeWidth={2} name="Leaves" />
                  <Line type="monotone" dataKey="requests" stroke="#10B981" strokeWidth={2} name="Requests" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Reports</h1>
          <p className="text-gray-600">Comprehensive analytics and insights</p>
        </div>
        <button
          onClick={generateReport}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-2 shadow-lg"
        >
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {reportTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReport(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeReport === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Reports;