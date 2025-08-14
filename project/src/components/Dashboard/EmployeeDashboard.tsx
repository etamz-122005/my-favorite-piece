import React, { useState } from 'react';
import { Calendar, FileText, DollarSign, Clock, User, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import LeaveRequest from '../Leave/LeaveRequest';
import WeeklyRequestForm from '../Requests/WeeklyRequestForm';
import EmployeeReports from '../Reports/EmployeeReports';

const EmployeeDashboard: React.FC = () => {
  const { currentUser, employees, leaveRequests, weeklyRequests } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  const currentEmployee = employees.find(emp => emp.id === currentUser?.employeeId);
  const employeeLeaves = leaveRequests.filter(req => req.employeeId === currentUser?.employeeId);
  const employeeRequests = weeklyRequests.filter(req => req.employeeId === currentUser?.employeeId);

  // Mock data for charts
  const attendanceData = [
    { month: 'Jan', hours: 160, target: 160 },
    { month: 'Feb', hours: 152, target: 160 },
    { month: 'Mar', hours: 168, target: 160 },
    { month: 'Apr', hours: 160, target: 160 },
    { month: 'May', hours: 172, target: 160 },
    { month: 'Jun', hours: 160, target: 160 }
  ];

  const salaryHistory = [
    { month: 'Jan', salary: currentEmployee?.totalSalary || 0 },
    { month: 'Feb', salary: (currentEmployee?.totalSalary || 0) * 0.95 },
    { month: 'Mar', salary: (currentEmployee?.totalSalary || 0) * 1.05 },
    { month: 'Apr', salary: currentEmployee?.totalSalary || 0 },
    { month: 'May', salary: (currentEmployee?.totalSalary || 0) * 1.08 },
    { month: 'Jun', salary: currentEmployee?.totalSalary || 0 }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'leave-request', label: 'Request Leave', icon: Calendar },
    { id: 'weekly-request', label: 'Weekly Request', icon: FileText },
    { id: 'reports', label: 'My Reports', icon: FileText }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'leave-request':
        return <LeaveRequest />;
      case 'weekly-request':
        return <WeeklyRequestForm />;
      case 'reports':
        return <EmployeeReports />;
      default:
        return (
          <div className="space-y-6">
            {currentEmployee && (
              <>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{currentEmployee.name}</h2>
                      <p className="text-blue-100">{currentEmployee.role} - {currentEmployee.department}</p>
                      <p className="text-blue-100">{currentEmployee.email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Monthly Salary</p>
                        <p className="text-2xl font-bold text-blue-600">${currentEmployee.totalSalary.toLocaleString()}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Hours Worked</p>
                        <p className="text-2xl font-bold text-green-600">{currentEmployee.hoursWorked}</p>
                      </div>
                      <Clock className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Leave Requests</p>
                        <p className="text-2xl font-bold text-orange-600">{employeeLeaves.length}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Weekly Requests</p>
                        <p className="text-2xl font-bold text-purple-600">{employeeRequests.length}</p>
                      </div>
                      <FileText className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} />
                        <Line type="monotone" dataKey="target" stroke="#10B981" strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Salary History</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salaryHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="salary" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold">Recent Leave Requests</h3>
                    </div>
                    <div className="p-6">
                      {employeeLeaves.length === 0 ? (
                        <p className="text-gray-500">No leave requests yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {employeeLeaves.slice(0, 3).map((leave) => (
                            <div key={leave.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{leave.startDate} - {leave.endDate}</p>
                                <p className="text-sm text-gray-600">{leave.reason}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {leave.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold">Recent Weekly Requests</h3>
                    </div>
                    <div className="p-6">
                      {employeeRequests.length === 0 ? (
                        <p className="text-gray-500">No weekly requests yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {employeeRequests.slice(0, 3).map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{request.title}</p>
                                <p className="text-sm text-gray-600">{request.description.substring(0, 50)}...</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                request.status === 'completed' ? 'bg-green-100 text-green-800' :
                                request.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
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

export default EmployeeDashboard;