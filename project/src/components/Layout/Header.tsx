import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useApp();

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">SOFTWIFY</h1>
              <p className="text-blue-100 text-sm">Employee Management System</p>
            </div>
          </div>
          
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="font-medium">
                  Welcome {currentUser.role === 'admin' ? 'Admin' : 'Employee'} {currentUser.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;