import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import DepartmentForm from './DepartmentForm';

const DepartmentManagement: React.FC = () => {
  const { departments, employees, deleteDepartment } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const getDepartmentStats = (deptName: string) => {
    const deptEmployees = employees.filter(emp => emp.department === deptName);
    const totalSalary = deptEmployees.reduce((sum, emp) => sum + emp.totalSalary, 0);
    const avgSalary = deptEmployees.length > 0 ? totalSalary / deptEmployees.length : 0;
    return {
      employeeCount: deptEmployees.length,
      totalSalary,
      avgSalary
    };
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    const department = departments.find(d => d.id === id);
    const deptEmployees = employees.filter(emp => emp.department === department?.name);
    
    if (deptEmployees.length > 0) {
      alert('Cannot delete department with existing employees. Please reassign employees first.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteDepartment(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDepartment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600">Organize and manage company departments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => {
          const stats = getDepartmentStats(department.name);
          return (
            <div key={department.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{department.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(department)}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(department.id)}
                      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{department.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Employees</span>
                    </div>
                    <span className="font-semibold text-blue-600">{stats.employeeCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Salary</span>
                    <span className="font-semibold text-green-600">${stats.totalSalary.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Salary</span>
                    <span className="font-semibold text-purple-600">${Math.round(stats.avgSalary).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((stats.employeeCount / Math.max(...departments.map(d => getDepartmentStats(d.name).employeeCount))) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Employee distribution</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No departments found</p>
          <p className="text-gray-400">Create your first department to get started</p>
        </div>
      )}

      {showForm && (
        <DepartmentForm
          department={editingDepartment}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default DepartmentManagement;