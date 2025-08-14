import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, DollarSign, Calendar, Clock, TrendingUp } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const EmployeeReports: React.FC = () => {
  const { currentUser, employees, leaveRequests, weeklyRequests } = useApp();
  const [activeReport, setActiveReport] = useState('overview');

  const currentEmployee = employees.find(emp => emp.id === currentUser?.employeeId);
  const employeeLeaves = leaveRequests.filter(req => req.employeeId === currentUser?.employeeId);
  const employeeRequests = weeklyRequests.filter(req => req.employeeId === currentUser?.employeeId);

  // Mock historical data
  const salaryHistory = [
    { month: 'Jan', salary: (currentEmployee?.totalSalary || 0) * 0.95, hours: 152 },
    { month: 'Feb', salary: (currentEmployee?.totalSalary || 0) * 0.96, hours: 156 },
    { month: 'Mar', salary: (currentEmployee?.totalSalary || 0) * 0.98, hours: 160 },
    { month: 'Apr', salary: (currentEmployee?.totalSalary || 0) * 0.99, hours: 158 },
    { month: 'May', salary: (currentEmployee?.totalSalary || 0), hours: 164 },
    { month: 'Jun', salary: (currentEmployee?.totalSalary || 0), hours: currentEmployee?.hoursWorked || 160 }
  ];

  const attendanceData = [
    { month: 'Jan', present: 20, absent: 2, late: 1 },
    { month: 'Feb', present: 18, absent: 1, late: 2 },
    { month: 'Mar', present: 22, absent: 1, late: 0 },
    { month: 'Apr', present: 21, absent: 2, late: 1 },
    { month: 'May', present: 23, absent: 0, late: 1 },
    { month: 'Jun', present: 22, absent: 1, late: 0 }
  ];

  const leaveStatusData = [
    { name: 'Approved', value: employeeLeaves.filter(req => req.status === 'approved').length },
    { name: 'Pending', value: employeeLeaves.filter(req => req.status === 'pending').length },
    { name: 'Rejected', value: employeeLeaves.filter(req => req.status === 'rejected').length }
  ];

  const requestStatusData = [
    { name: 'Completed', value: employeeRequests.filter(req => req.status === 'completed').length },
    { name: 'Reviewed', value: employeeRequests.filter(req => req.status === 'reviewed').length },
    { name: 'Pending', value: employeeRequests.filter(req => req.status === 'pending').length }
  ];

  const generatePersonalReport = () => {
    if (!currentEmployee) return;

    const reportData = {
      date: new Date().toLocaleDateString(),
      employee: currentEmployee.name,
      department: currentEmployee.department,
      role: currentEmployee.role,
      monthlySalary: currentEmployee.totalSalary,
      hourlyRate: currentEmployee.hourlyRate,
      hoursWorked: currentEmployee.hoursWorked,
      totalLeaves: employeeLeaves.length,
      approvedLeaves: employeeLeaves.filter(req => req.status === 'approved').length,
      totalRequests: employeeRequests.length,
      completedRequests: employeeRequests.filter(req => req.status === 'completed').length
    };

    const csvContent = `SOFTWIFY - Personal Employee Report
Generated: ${reportData.date}

EMPLOYEE INFORMATION
Name: ${reportData.employee}
Department: ${reportData.department}
Role: ${reportData.role}

SALARY INFORMATION
Monthly Salary: $${reportData.monthlySalary.toLocaleString()}
Hourly Rate: $${reportData.hourlyRate}
Hours Worked: ${reportData.hoursWorked}

LEAVE SUMMARY
Total Leave Requests: ${reportData.totalLeaves}
Approved Leaves: ${reportData.approvedLeaves}

REQUEST SUMMARY
Total Weekly Requests: ${reportData.totalRequests}
Completed Requests: ${reportData.completedRequests}

RECENT LEAVE HISTORY
${employeeLeaves.slice(0, 5).map(leave => 
  `${leave.startDate} to ${leave.endDate} - ${leave.status} - ${leave.reason}`
).join('\n')}
`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentEmployee.name}-Personal-Report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const reportTabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'salary', label: 'Salary History', icon: DollarSign },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leaves', label: 'Leave History', icon: Calendar }
  ];

  const renderContent = () => {
    switch (activeReport) {
      case 'salary':
        return (
          <div className="space-y-6">
            {currentEmployee && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold">Current Salary</h3>
                  <p className="text-3xl font-bold">${currentEmployee.totalSalary.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold">Hourly Rate</h3>
                  <p className="text-3xl font-bold">${currentEmployee.hourlyRate}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold">Hours Worked</h3>
                  <p className="text-3xl font-bold">{currentEmployee.hoursWorked}</p>
                </div>
              </div>
            )}
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">6-Month Salary Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salaryHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="salary" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Hours Worked Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'attendance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Days Present</h3>
                <p className="text-3xl font-bold">{attendanceData.reduce((sum, data) => sum + data.present, 0)}</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Days Absent</h3>
                <p className="text-3xl font-bold">{attendanceData.reduce((sum, data) => sum + data.absent, 0)}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Late Days</h3>
                <p className="text-3xl font-bold">{attendanceData.reduce((sum, data) => sum + data.late, 0)}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Monthly Attendance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#10B981" name="Present" />
                  <Bar dataKey="absent" fill="#EF4444" name="Absent" />
                  <Bar dataKey="late" fill="#F59E0B" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'leaves':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Approved Leaves</h3>
                <p className="text-3xl font-bold">{employeeLeaves.filter(req => req.status === 'approved').length}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Pending Leaves</h3>
                <p className="text-3xl font-bold">{employeeLeaves.filter(req => req.status === 'pending').length}</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Rejected Leaves</h3>
                <p className="text-3xl font-bold">{employeeLeaves.filter(req => req.status === 'rejected').length}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Leave Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveStatusData.filter(item => item.value > 0)}
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
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Request Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={requestStatusData.filter(item => item.value > 0)}
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
            
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Leave History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employeeLeaves.map((leave) => (
                      <tr key={leave.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {leave.startDate} - {leave.endDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{leave.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                            leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.requestDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {employeeLeaves.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No leave requests found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            {currentEmployee && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Monthly Salary</p>
                      <p className="text-2xl font-bold">${currentEmployee.totalSalary.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Hours Worked</p>
                      <p className="text-2xl font-bold">{currentEmployee.hoursWorked}</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Total Leaves</p>
                      <p className="text-2xl font-bold">{employeeLeaves.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-orange-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Total Requests</p>
                      <p className="text-2xl font-bold">{employeeRequests.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-purple-200" />
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Salary Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salaryHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="salary" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#10B981" name="Present Days" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-600">Personal performance and history analytics</p>
        </div>
        <button
          onClick={generatePersonalReport}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-2 shadow-lg"
        >
          <Download className="w-5 h-5" />
          <span>Export My Report</span>
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

export default EmployeeReports;