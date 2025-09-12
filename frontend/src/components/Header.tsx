import React, { useState } from "react";
import { logout } from "../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { UserRole } from "../types/auth";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setShowDropdown(false);
    } catch (error) {
      console.error("Logout failed:", error);
      // Still close dropdown even if logout fails
      setShowDropdown(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Administrator";
      case UserRole.OPERATIONS_MANAGER:
        return "Operations Manager";
      case UserRole.CUSTOMER_SERVICE:
        return "Customer Service";
      case UserRole.FINANCE:
        return "Finance";
      case UserRole.FIELD_STAFF:
        return "Field Staff";
      default:
        return role;
    }
  };

  return (
    <header className="bg-indigo-900 text-white shadow-lg">
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">
            AMS - Automotive Management System
          </h1>
        </div>

        {/* User Section */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-indigo-200">
                  {getRoleDisplayName(user.role)}
                </p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-indigo-200 hover:text-white transition-colors focus:outline-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </a>
                  {user.role === UserRole.ADMIN && (
                    <a
                      href="/admin/users"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      User Management
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
